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
    return await fetch("https://app.prodigo.com.tr/Services/UrunYonetimi/Urunler/List", {
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
            "x-csrf-token": "CfDJ8Mjn_acsws9LkLR9PS47cVihNskHN2u0NkS781tQAFsYNVvHImTwARVuevztJg7gLKAySxwXUwOQO-UyyYtNz0ML3yF8feN4DC0HK09vck3GSRKLpDcGiUs5HLlniBd2EQKE2GX9ZnxTcgVLAYNE_vrwuBnmRD3w7eCErBTpQU3A-iufyjAYqu04f3aNMeqyvA",
            "x-requested-with": "XMLHttpRequest",
            "cookie": ".AspNetCore.Antiforgery.SQBnuFbFx1I=CfDJ8Mjn_acsws9LkLR9PS47cVglBmCNOMJbjp6xyLCYhsVai6X_IM45nQuT5v5PWi1YIr1JiX0tyjjTG4-TZ7_pSMS2smdHxWpWpT-7Lvxe8AAv7nHmglRx6hGh80o7PgFY1mgDp5xB9-Oz95IsjFI8uJw; .AspNetAuth=CfDJ8Mjn_acsws9LkLR9PS47cVjZVgH8o_xDRQfZyRRPjg8yhAwiYC4Ph7IDM3h9mXZpsKJqRlG44R9PKGCNXxCCgn-8drRoxeaULyPRULwjlEvyFjko3SejebLFPCryMibpCzZZ7j9rnp5li_R2PCeUtU7krrSBJwpNv3Csam965rOQDA1XlNy-jLfn4H9TXC5IOg0e3FCfAv-wkBWu90HY6c46Pc4AOqvTtJxwLmtDOnvYttXH5-QdNi1JiAM5DO1ghmKr8x_fk0wbtMDRcKwySAEqfXu9lcQ6RWTMyK3RAfnEic6-uBU84AgKof9Hnkkslce0yGfoJf8LXsheQkEMnO0TEOhM4PfnLmo6gHWPwJ_vE80XMXum6D0BndRmb376-5ty4_j4JFx0Ha9KDZPu5AS9SHmP_ZbAESi0hbiUVwaYK7ND-4ZEQWWd9hEK-2YF1A; CSRF-TOKEN=CfDJ8Mjn_acsws9LkLR9PS47cVihNskHN2u0NkS781tQAFsYNVvHImTwARVuevztJg7gLKAySxwXUwOQO-UyyYtNz0ML3yF8feN4DC0HK09vck3GSRKLpDcGiUs5HLlniBd2EQKE2GX9ZnxTcgVLAYNE_vrwuBnmRD3w7eCErBTpQU3A-iufyjAYqu04f3aNMeqyvA",
            "Referer": "https://app.prodigo.com.tr/UrunYonetimi/Urunler",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "{\"Take\":999999,\"IncludeColumns\":[\"UrunKodu\",\"Barkodu\",\"UrunIsim\",\"AnaGrupAdi\",\"KategoriAdi\",\"MarkaAdi\",\"ToplamStok\",\"UrunSatisFiyati\",\"UrunSonAlisFiyati\",\"TedarikciUnvani\"],\"EqualityFilter\":{\"AnagrupId\":\"\",\"KategoriId\":\"\",\"MarkaId\":\"\"}}",
        "method": "POST"
    }).then((res) => { return res.json() as Promise<itemRes> })
}

export const fetchCustomerGroups = async () => {
    try {
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
            console.log("data : ", res);

            return JSON.parse(extractData(data)) as Grup[]
        });
    } catch { (e) => { return e } }

}