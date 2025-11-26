import { useState } from 'react';
import type { CheckoutFormData, Order, PaymentMethod, PaymentResponse } from '../types';
import { createPixCharge, createPaymentLink } from '../lib/payment/infinitepay';
import { v4 as uuidv4 } from 'uuid';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

interface UsePaymentState {
  status: PaymentStatus;
  method: PaymentMethod;
  response?: PaymentResponse;
  error?: string;
}

export function usePayment() {
  const [state, setState] = useState<UsePaymentState>({
    status: 'idle',
    method: 'pix',
  });

  async function pay(
    formData: CheckoutFormData,
    items: Order['items'],
    total: number,
  ): Promise<PaymentResponse | undefined> {
    setState((prev) => ({ ...prev, status: 'processing', error: undefined }));

    const order: Order = {
      id: uuidv4(),
      items,
      total,
      paymentMethod: formData.paymentMethod,
      status: 'pending',
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf,
        street: formData.street,
        number: formData.number,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
    };

    try {
      let response: PaymentResponse;

      if (formData.paymentMethod === 'pix') {
        response = await createPixCharge(order);
      } else {
        response = await createPaymentLink(order);
      }

      setState({
        status: response.success ? 'success' : 'error',
        method: formData.paymentMethod,
        response,
        error: response.error,
      });

      return response;
    } catch (error) {
      setState({
        status: 'error',
        method: formData.paymentMethod,
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao processar pagamento',
      });
    }
  }

  function reset() {
    setState((prev) => ({
      status: 'idle',
      method: prev.method,
      response: undefined,
      error: undefined,
    }));
  }

  return {
    state,
    pay,
    reset,
    setMethod(method: PaymentMethod) {
      setState((prev) => ({ ...prev, method }));
    },
  };
}


