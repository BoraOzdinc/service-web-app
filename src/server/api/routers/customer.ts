import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { customerRes } from "~/utils/types";

export const customerRouter = createTRPCRouter({
  getCustomerList: protectedProcedure
    .input(z.object({ Take: z.number().min(0), IncludeColumns: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      const data = await fetch("https://app.prodigo.com.tr/Services/MusteriYonetimi/Musteriler/List", {
        "headers": {
          "accept": "application/json, text/javascript, */*; q=0.01",
          "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json",
          "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Opera\";v=\"106\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrf-token": "CfDJ8J00Jn2uUtZKjY71iLN1mlWJjdA2JWuaqwFB0ftfcFlcNtfUnWPOlhh5tsRxAQDtm0vyvp4SO823sbgzIWul4AiQym12xUnS-7THjsvDjD_Qfbwr8787E85uTUe4EHr8lz7xuT322MA2obHIfobNE9xxFMSrQ-ucm_OCaA3PREhRRQecQ45-nrqP1o4Y24J2vA",
          "x-requested-with": "XMLHttpRequest",
          "cookie": ".AspNetCore.Antiforgery.SQBnuFbFx1I=CfDJ8J00Jn2uUtZKjY71iLN1mlXs5UfWRuNRCVvhdLytJS_-ph9Fh1YR04Xejgenz4qv8yQWpVVVs3-ji8SeS5Z8GM5_x8sA6wxZDs1I0Mtw6oFZwEznPOMLbr-2nxzIjMAFXqMuLe_g0wh5uRsxWcsxp58; .AspNetAuth=CfDJ8J00Jn2uUtZKjY71iLN1mlXSn-zGhYI8M2G31DTcRlbmUcCkKJHNqiJGJn6xM16NLd3H9yNVssdSO5Aih8w_iVTNnd0w8vN8BADf4DM00aHRNr3swlFmjHVnLbUBLh_QxNB8lwruufPw3GbpHX9XgCtKSOLPA_fxNJsjFoMdbHcOG5eQl4ofAUSjD8LwPE5Z8Q31yXZHyq7rMN943egE9yOQurHqgCCV89YeqQlHkskzlb2khNwldVEH2huWTFw89Pzr-vAnBu4pTGmUydlLQiPPK-aEPShrblxak-P7lwjqLjcLNP2wAT-_ZF_0se8MadxAzdZ2etIWRAEl62An2ZpE3LHM0ty--coX1bkmF8P7LSH1Pk1YpwWQzC6Sse1YbdDVRpX8vnKnQW0z2DrpSY6983jtAFKVmQbjRtr8EJjmH3330fZnE6NgJ4czhYc2DA; CSRF-TOKEN=CfDJ8J00Jn2uUtZKjY71iLN1mlWJjdA2JWuaqwFB0ftfcFlcNtfUnWPOlhh5tsRxAQDtm0vyvp4SO823sbgzIWul4AiQym12xUnS-7THjsvDjD_Qfbwr8787E85uTUe4EHr8lz7xuT322MA2obHIfobNE9xxFMSrQ-ucm_OCaA3PREhRRQecQ45-nrqP1o4Y24J2vA",
          "Referer": "https://app.prodigo.com.tr/MusteriYonetimi/Musteriler",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": JSON.stringify(input),
        //"body": "{\"Take\":999999,\"IncludeColumns\":[\"MusteriKodu\",\"MusteriUnvani\",\"MusteriTelefon\",\"MusteriEposta\",\"GrupAdi\",\"MusteriBayiAdi\",\"FiyatTipAdi\"]}",
        "method": "POST"

      }).then((res) => { return res.json() as Promise<customerRes> });
      console.log(data);

      return data;


    }),

});
