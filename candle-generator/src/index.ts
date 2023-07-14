import { config } from 'dotenv';
import axios from 'axios';
import Candle from './models/Candle';
import Period from './enums/Period';
import { createMessageChannel } from './messages/messageChannel';

config();

const readMarketPrice = async (): Promise<{ bitcoinCashprice: number, bitcoinPrice: number }>  => {
    const result = await axios.get(process.env.PRICES_API);
    const data = result.data;
    const bitcoinPrice = data.bitcoin.brl;
    const bitcoinCashprice = data['bitcoin-cash'].brl;
    const price = { bitcoinCashprice, bitcoinPrice };
    return price;
};

const generateCandles = async () => {
    const messageChannel = await createMessageChannel();

    if (messageChannel) {
        while (true) {
            const loopTimes = Period.ONE_MINUTE / Period.TEN_SECONDS;
            const candleBtc = new Candle('BTC');
            const candleBtcCash = new Candle('BTC-CASH');

            console.log('---------------------------------------');
            console.log('Generating new candle');

            for (let i = 0; i < loopTimes; i++) {
                const price = await readMarketPrice();
                candleBtc.addValue(price.bitcoinPrice);
                candleBtcCash.addValue(price.bitcoinCashprice);
                console.log(`Market price bitcoin and bitcoinCash #${i + 1} of ${loopTimes}`);
                await new Promise(r => setTimeout(r, Period.TEN_SECONDS));
            }

            candleBtc.closeCandle();
            candleBtcCash.closeCandle();
            console.log('Candle close');
            const candleObjBtc = candleBtc.toSimpleObject();
            const candleObjBtcCash = candleBtcCash.toSimpleObject();
            console.log(candleObjBtc, candleObjBtcCash);
            const candleJson = JSON.stringify({ 
                candleBtc: candleObjBtc, 
                candleBtcCash: candleObjBtcCash });
            messageChannel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(candleJson));
            console.log('Candle sent to queue');
        }
    }
};

generateCandles();
