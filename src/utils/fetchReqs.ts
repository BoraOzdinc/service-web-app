import { extractData } from ".";
import { Grup, customerRes, itemRes } from "./types";

export const fetchCustomerList = async () => {
    return await fetch("https://app.prodigo.com.tr/Services/MusteriYonetimi/Musteriler/List", {
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
        "body": "{\"Take\":999999,\"IncludeColumns\":[\"MusteriKodu\",\"MusteriUnvani\",\"MusteriTelefon\",\"MusteriEposta\",\"GrupAdi\",\"MusteriBayiAdi\",\"FiyatTipAdi\"]}",
        "method": "POST"

    }).then((res) => { return res.json() as Promise<customerRes> });
};

export const fetchItems = async () => {
    const rawData = await fetch("https://app.prodigo.com.tr/Services/UrunYonetimi/Urunler/List", {
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
            "x-csrf-token": "CfDJ8Fe8p28q9kRHrRT-7wZanmQmW47Yi0NNmkjmXlDp8T2yYjsaTtV1Hrlc7yvIInz4AFjV6PKbbwZN6bks0RoLQWLST54YZnfSp2Ut5xGMjIISiMJucfwDexBPSuWhxCOq1VaceI8nJ3mQQdmpIxQopMhGdtl2_69EeKxq6axPM6aAt9zB4YDi7UeT5JB-YxiZPA",
            "x-requested-with": "XMLHttpRequest",
            "cookie": ".AspNetCore.Antiforgery.SQBnuFbFx1I=CfDJ8Fe8p28q9kRHrRT-7wZanmSqO1S07TpCNSaqrPeYX05WYJ6-TDE6a7b6gYF2fiAQZGeVZ7rTWQsVuwT_RRNqcqp-AZ6ofFb0N3GAIGhQLFu6IE1BT9h-JJEQgcZ_kVB8x6OGEJu7dp56MvAWOFyByUI; .AspNetAuth=CfDJ8Fe8p28q9kRHrRT-7wZanmQ6fJwPk_ymPy_cQAyYbbJ5qnqddpoL_jtvgN60YJxZkOiM2DI-1XAn6bK8-k5iU5OjO7ccBFz3RDd3VMHbNYpOuPfJJtj_WYuJQ-wbkPzDAgz2yfI-83qJq15CvFJx-tIlJa64D96airGkt_E3S6X9KnFL9_tYQQp6rN6wLEKEPtu1HFlPPuskuJEdFlT9BsgoUBcn9emG02trPH6eUY2CTHu-tglHb_PpGWgYV8CM10okH1p3ZDQxkzHapC4RC49Qmu-74B_Hh3a-uys6zdKxyNwa6_19QyrqoD2cF2TliW7gT3F3RCrxb7rTfzPy41BgBgWWXILVE1lAjmrMmxWBivtNNI8tw4CnryC7mA15kMr7vYQmCrwrS9AOXFvUwjk-YbaY6CW3Fdg7Ek0aEXL_kJFOEqopmE6S3ifTraxwXA; CSRF-TOKEN=CfDJ8Fe8p28q9kRHrRT-7wZanmQmW47Yi0NNmkjmXlDp8T2yYjsaTtV1Hrlc7yvIInz4AFjV6PKbbwZN6bks0RoLQWLST54YZnfSp2Ut5xGMjIISiMJucfwDexBPSuWhxCOq1VaceI8nJ3mQQdmpIxQopMhGdtl2_69EeKxq6axPM6aAt9zB4YDi7UeT5JB-YxiZPA",
            "Referer": "https://app.prodigo.com.tr/UrunYonetimi/Urunler",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{\"Take\":1,\"IncludeColumns\":[\"UrunKodu\",\"Barkodu\",\"UrunIsim\",\"AnaGrupAdi\",\"KategoriAdi\",\"MarkaAdi\",\"ToplamStok\",\"UrunSatisFiyati\",\"UrunSonAlisFiyati\",\"TedarikciUnvani\"],\"EqualityFilter\":{\"AnagrupId\":\"\",\"KategoriId\":\"\",\"MarkaId\":\"\"}}",
        "method": "POST"
    });
    const content = (await rawData.json()) as itemRes;
    return content
}

export const fetchCustomerGroups = async () => {
    return await fetch("https://app.prodigo.com.tr/DynJS.axd/Lookup.MusteriYonetimi.MusteriGruplari.js?638424231858629500", {
        "headers": {
            "accept": "text/plain, */*; q=0.01",
            "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Opera\";v=\"106\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": "CfDJ8J00Jn2uUtZKjY71iLN1mlUXU255h5G8oxTPePcJ2HYun4WtnthGBifxWZwrcKX96XDfX0hOmqY7VY-JaGiH4c8XPXA59THbVxf3z32tV5x2a0aBNJZAoKraVkeB-MH8M3bU4FBCDPrXDvXda3Ra_70jDBa4Xz39BUk7jZ7VIV0WdbzqARK0V6OUfhq75mpCAQ",
            "x-requested-with": "XMLHttpRequest",
            "cookie": ".AspNetCore.Antiforgery.SQBnuFbFx1I=CfDJ8J00Jn2uUtZKjY71iLN1mlXs5UfWRuNRCVvhdLytJS_-ph9Fh1YR04Xejgenz4qv8yQWpVVVs3-ji8SeS5Z8GM5_x8sA6wxZDs1I0Mtw6oFZwEznPOMLbr-2nxzIjMAFXqMuLe_g0wh5uRsxWcsxp58; .AspNetAuth=CfDJ8J00Jn2uUtZKjY71iLN1mlVLDMBqkIITMXjsBiBtOOUNsxhYcwnRXf0gmVHmBWxoM2TobDFucDCIiJTP4uUh2J1PzFhogCDkdeUf0X9UJS0VaPkhf9oCUcuQg65A2EPCEBTM72o5VJrzOiqG0dsWb-bvUHHYlXHmx4bkuOG2kDEeKc9MSXCUS7o4OYAT3fwyc5nSaTO0NtyH205sosGaUlRxaA9lUtITTljDfY53EHZc7rWixTxRY8zVsu-szbrRyPzojz0aEl4V3ycHn9jf3wWhMEUb6XKOWAhWoFa9DAzieHHACDX6KBF5L0-wSPGUdHYdK-yipm0mWiHxhJ5MvS3BvfD7i6moJmgN5wm_jyXbQf2Wvaz4kBMiIcyoN84yaxxbSYhyXdHWJzjvLTfZo7mD7-DV8FfqKOTo-rcwYzkpkHSoq-URag_qezlJg8eDlw; CSRF-TOKEN=CfDJ8J00Jn2uUtZKjY71iLN1mlUXU255h5G8oxTPePcJ2HYun4WtnthGBifxWZwrcKX96XDfX0hOmqY7VY-JaGiH4c8XPXA59THbVxf3z32tV5x2a0aBNJZAoKraVkeB-MH8M3bU4FBCDPrXDvXda3Ra_70jDBa4Xz39BUk7jZ7VIV0WdbzqARK0V6OUfhq75mpCAQ",
            "Referer": "https://app.prodigo.com.tr/MusteriYonetimi/Musteriler",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }).then(async (res) => {
        const data = await res.text();
        return JSON.parse(extractData(data)) as Grup[]
    });
}