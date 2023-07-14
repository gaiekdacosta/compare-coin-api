import { model, Document, Schema } from 'mongoose';

export interface Candle extends Document {
    candleBtc: {
        currency: string
        finalDateTime: Date
        open: number
        close: number
        high: number
        low: number
        color: string
    }
    candleBtcCash:{
        currency: string
        finalDateTime: Date
        open: number
        close: number
        high: number
        low: number
        color: string
    }
}

const schema = new Schema<Candle>({
    candleBtc: {
        currency: { type: String, required: true },
        finalDateTime: { type: Date, required: true },
        open: { type: Number, required: true },
        close: { type: Number, required: true },
        high: { type: Number, required: true },
        low: { type: Number, required: true },
        color: { type: String, required: true }
    },
    candleBtcCash: {
        currency: { type: String, required: true },
        finalDateTime: { type: Date, required: true },
        open: { type: Number, required: true },
        close: { type: Number, required: true },
        high: { type: Number, required: true },
        low: { type: Number, required: true },
        color: { type: String, required: true }
    }
});

export const CandleModel = model<Candle>('Candle', schema);
