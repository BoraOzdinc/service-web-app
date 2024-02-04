export type customerRes = {
    Entities: customerEntity[],
    Values: unknown,
    TotalCount: number,
    Skip: number,
    Take: number,
    Error: unknown,
    CustomData: unknown
}
export type customerEntity = {
    TenantId: number,
    MusteriId: number,
    MusteriUnvani: string,
    MusteriKodu: string,
    MusteriTip: string,
    MusteriTelefon: string,
    MusteriFax: string,
    MusteriEposta: string,
    MusteriVergiDairesi: string,
    MusteriVergiNo: number,
    GrupId: number,
    MusteriKayitYeriId: number,
    MusteriAdiSoyadi: string,
    MusteriIlgiliUnvani: string,
    MusteriIlgiliTelefon: string,
    MusteriIlgiliEposta: string,
    MusteriOzelIndirim: string,
    MusteriKayitYeri: string,
    MusteriEfatura: number,
    MusteriBildirimSms: string,
    MusteriBildirimEposta: string,
    MusteriOnlineSiparisVerebilir: number,
    GrupAdi: string,
    FiyatTipId: number,
    FiyatTipAdi: string,
    MusteriBayiAdi: string,
    MusteriBayiId: number,
    MusteriKargoAdiSoyadi: string,
    MusteriKargoTelefon: string,
    MusteriKargoUlke: string,
    MusteriKargoIl: string,
    MusteriKargoIlce: string,
    MusteriKargoMahalle: string,
    MusteriKargoPostaKodu: string,
    MusteriKargoAdresi: string,
    MusteriFirmaUnvani: string,
    MusteriFaturaUlke: string,
    MusteriFaturaIl: string,
    MusteriFaturaIlce: string,
    MusteriFaturaMahalle: string,
    MusteriFaturaPostaKodu: number,
    MusteriFaturaAdresi: string
}




export type Grup = {
    GrupId: number;
    GrupAdi: string;
};

