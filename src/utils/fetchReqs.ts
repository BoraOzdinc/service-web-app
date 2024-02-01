import { customerRes, itemRes } from "./types";

export const fetchCustomerList = async () => {
    const rawResponse = await fetch(
        "https://app.prodigo.com.tr/Services/MusteriYonetimi/Musteriler/List",
        {
            headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Opera";v="106"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-csrf-token":
                    "CfDJ8Fe8p28q9kRHrRT-7wZanmRr5nOaNFZGGGoW6wDGpQRfZjzKPg5JzbJHyISBKiRa5fQlPohZWySIU6czZe9wuX7m_j_4UqPVOAaKSxELDgCCezrPCv3Df937JqUWahlk6umrdzWNQLJUdsZ-cTiqS66xLx3Fs0OVtzT9LuaNBJUO_t18uATNnNdoBYuutErHFg",
                "x-requested-with": "XMLHttpRequest",
                cookie:
                    ".AspNetCore.Antiforgery.SQBnuFbFx1I=CfDJ8Fe8p28q9kRHrRT-7wZanmSqO1S07TpCNSaqrPeYX05WYJ6-TDE6a7b6gYF2fiAQZGeVZ7rTWQsVuwT_RRNqcqp-AZ6ofFb0N3GAIGhQLFu6IE1BT9h-JJEQgcZ_kVB8x6OGEJu7dp56MvAWOFyByUI; .AspNetAuth=CfDJ8Fe8p28q9kRHrRT-7wZanmSp0TUztQCHCNyx2NqbnhsnWExR7kTwjZ8h_maauxk0YnIeES4ibfHT3wVmSke44M6kwMRP_s5Dgadd4DK3-u01XPKfRbz5HNebvgXnzeZHJqilj8A_yWN77xOoujPJ_BOozyetBKLFEJiO7c5Lr-L3ldKpvzYzLyoLFsXlQmzrJvrt0qckXLhOycH0oF025oUBNEy3MPRUOhF402_dlSrD8msyzP6N_NQMOxmbDOVUQ-nrpcNHe-nGvYXUMgmnBImXLBjVnNgbQt0WxN0T5YT5eWZwQmiqnDd8mLO2NBTdSiaPN_KsCWaEIpRQCsV-5eRPRkWlZTVDGCb53zI65FKqPpzCqF8_2h4YUvSPGioWLC8Zf9UHHyMwSIHYRA0SWMwXw9qVqBeT_0No_JrX7ZalE_8hQEu-wv6LKB4EF6dkFg; CSRF-TOKEN=CfDJ8Fe8p28q9kRHrRT-7wZanmRr5nOaNFZGGGoW6wDGpQRfZjzKPg5JzbJHyISBKiRa5fQlPohZWySIU6czZe9wuX7m_j_4UqPVOAaKSxELDgCCezrPCv3Df937JqUWahlk6umrdzWNQLJUdsZ-cTiqS66xLx3Fs0OVtzT9LuaNBJUO_t18uATNnNdoBYuutErHFg",
                Referer: "https://app.prodigo.com.tr/MusteriYonetimi/Musteriler",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: '{"Take":999999,"IncludeColumns":["MusteriKodu","MusteriUnvani","MusteriTelefon","MusteriEposta","GrupAdi","MusteriBayiAdi","FiyatTipAdi"]}',
            method: "POST",
        },
    );
    const content = (await rawResponse.json()) as customerRes;
    return content;
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