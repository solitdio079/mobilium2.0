/* eslint-disable react/prop-types */
import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useLocation } from 'react-router'

export default function CheckoutForm({ dpmCheckerLink }) {
  const stripe = useStripe()
    const elements = useElements()
    const location = useLocation()
  //console.log(dpmCheckerLink)
  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `https://mobilium.info${location.pathname}/complete`,
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message)
    } else {
      setMessage('An unexpected error occurred.')
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: 'tabs',
  }

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button
          className="btn btn-primary w-full my-3"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span className="icon-[tabler--stripe] size-6"></span>
          <span id="button-text">
            {isLoading ? (
              <span className="loading loading-infinity loading-md"></span>
            ) : (
              'Pay now'
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message my-3">{message}</div>}
      </form>
      {/* [DEV]: Display dynamic payment methods annotation and integration checker */}
      <div id="dpm-annotation">
        <p>
          Les modes de paiement sont affichés dynamiquement en fonction de la
          localisation du client, montant de la commande et devise.&nbsp;
          <a
            href={dpmCheckerLink}
            target="_blank"
            rel="noopener noreferrer"
            id="dpm-integration-checker"
          >
            Aperçu des modes de paiement par transaction.
          </a>
        </p>
      </div>
    </>
  )
}
