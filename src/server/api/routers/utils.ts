import { type EuroPriceType } from "~/utils/euroPrice";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const UtilsRouter = createTRPCRouter({
    getEuroPrice: protectedProcedure.query(async () => {

        const price = await fetch("https://www.nadirdoviz.com/api/KurOku", {
            "headers": {
                "accept": "*/*",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "content-type": "application/json; charset=utf-8",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Opera\";v=\"108\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "_gid=GA1.2.664106028.1713096509; _gat_gtag_UA_4980493_8=1; _ga=GA1.1.305291332.1713096509; _ga_BCPVNPVPTH=GS1.1.1713096509.1.1.1713098002.6.0.0",
                "Referer": "https://www.nadirdoviz.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"grupId\":null,\"kayitSayisi\":null,\"grupListYukle\":false,\"ilkGrupKurlariGetir\":false,\"anahtar\":null,\"bolgeMarjListesiniBellegeYukle\":false,\"sessionId\":\"\"}",
            "method": "POST"
        });
        const priceJson = await price.json() as EuroPriceType;
        return priceJson.list.find(i => i.kurId === 5)
    })

})