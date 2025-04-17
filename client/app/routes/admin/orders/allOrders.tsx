import { serverUrl } from "~/utils/serverUrl";
import DataTableBase from "~/components/DataTableBase";
import type { Route } from "../+types/AdminRoot";
import { UserContext } from "~/utils/contexts";
import { useContext } from "react";
import { useFetcher } from "react-router";
export async function clientLoader() {
  try {
    const req = await fetch(serverUrl + "/orders/", {
      method: "GET",
      mode: "cors",
      credentials: "include",
    });
    const response = await req.json();
    return response;
  } catch (error) {
    return { error };
  }
}

export default function AllOrders({ loaderData }: Route.ComponentProps) {
  const allOrders = loaderData;
  const user = useContext(UserContext)
  const fetcher = useFetcher()
  const columns = [
    {
      name: "ID",
      selector: (row: any) => row._id,
    },
    {
      name: "Panier",
      selector: (row: any) => {
        return (
          <>
            <button
              type="button"
              className="btn btn-primary"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls={`cart_modal_${row._id}`}
              data-overlay={`#cart_modal_${row._id}`}
            >
             <span className="icon-[tabler--eye] size-4"></span>
            </button>

            <div
              id={`cart_modal_${row._id}`}
              className="overlay modal overlay-open:opacity-100 hidden overlay-open:duration-300"
              role="dialog"
              tabIndex={-1}
            >
              <div className="modal-dialog overlay-open:opacity-100 overlay-open:duration-300">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title">Panier #{row._id} </h3>
                    <button
                      type="button"
                      className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
                      aria-label="Close"
                      data-overlay="#basic-modal"
                    >
                      <span className="icon-[tabler--x] size-4"></span>
                    </button>
                  </div>
                  <div className="modal-body overflow-y-auto">
                  {row.cart.items && row.cart.items.length > 0
              ? row.cart.items.map((item) => (
                  <div key={item.id} className="dropdown-item">
                    <div className="avatar">
                      <div className="w-20 rounded-none">
                        <img
                          src={serverUrl + '/' + item.image}
                          alt="User Avatar"
                        />
                      </div>
                    </div>
                    <div className="w-42 sm:w-47 flex flex-col">
                      <h6 className="truncate text-base"> {item.name} </h6>
                      <small className="text-base-content/50 truncate">
                        Prix: 
                        {parseFloat(
                          item.price.$numberDecimal || item.price
                        ).toFixed()}{' '}
                        FCFA
                      </small>
                      <small className="text-base-content/50 truncate">
                        Qte: {item.qty}
                      </small>
                    </div>
                   
                  </div>
                ))
              : ''}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      },
    },
    {
        name: "Proprietaire",
        selector: (row:any) => row.user.email
    },
    {
        name: "Address",
        selector: (row:any) => row.address.addressLines
    },
    {
        name: "Date",
        selector: (row:any) => row.updatedAt
    },
    {
        name: "Status",
        selector: (row: any) => {
            user.isAdmin ? <fetcher.Form method="post" action={ `/admin/editOrderStatus/${row._id}`}>
                <input type="text" name="status" className="input" defaultValue={row.status} /> 
                <button className="btn btn-info"> {fetcher.state === 'idle' ? 'Changer': <span className="loading loading-ball"></span>} </button>
                </fetcher.Form> : row.status
        }
    },
    {
        name: "Total",
        selector: (row:any) => row.total.$numberDecimal
    }
  ];
  return (<div className="flex flex-col m-5 p-5 max-w-full overflow-x-auto">
    <DataTableBase columns={columns} data={allOrders} selectableRows />
</div>);
}
