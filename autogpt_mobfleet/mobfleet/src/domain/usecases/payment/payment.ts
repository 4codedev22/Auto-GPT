import { ChargeStatus } from '../../enumeration/charge-status';
import { OrderStatus } from '../../enumeration/order-status';

export interface IPayment {
	createOrder: (order: IPayment.CreateOrderParams) => Promise<IPayment.CreateOrderResult>;

	cancelOrder: (params: IPayment.CancelOrderParams) => Promise<IPayment.CancelOrderResult>

	getOrder: (orderId: string, companyID: number) => Promise<IPayment.GetOrderResult>
}

export namespace IPayment {
	export type OrderItem = {
		description: string;
		valueCents: number;
		quantity: number;
	}

	export type CreateOrderParams  = {
		item: OrderItem;
		description: string;
		paymentMethod: string;
		cardId?: string;
		clientId: string;
		companyId: number;
	}

	export type CreateOrderResult = {
		orderId?: string;
		cardLastFourDigits?: string;
		cardBrand?: string;
		orderStatus: OrderStatus;
		chargeStatus: ChargeStatus;
		chargeInfo?: any;
	}

	export type GetOrderResult = CreateOrderResult
	
	export type CancelOrderParams = {
		companyId: number;
		orderId: string;
	}

	export type CancelOrderResult = any
}
