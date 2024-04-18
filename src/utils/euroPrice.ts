export interface EuroPriceType {
    list: List[]
    grupList: unknown
    bellek: Bellek
    fiyatAcikKapali: number
    kurYenilemeSuresiMs: number
    message: string
    duration: number
    errorCode: number
    success: boolean
    errorMessage: string
}

export interface List {
    kurId: number
    parite: string
    tarih: string
    alis: number
    satis: number
    satisFiyatSecim: number
    alisMarjMilyem: number
    satisMarjMilyem: number
    alisMarj: number
    satisMarj: number
    alisEkran: number
    satisEkran: number
    birim: string
    fark: number
    sira: number
    marjBolum: number
    baslik?: string
    ondalik: number
}

export interface Bellek {
    tarih: string
    grupList: GrupList[]
    grupPariteList: GrupPariteList[]
    kurList: KurList[]
    bolgeMarjList: unknown[]
    hamFiyat: number
    dbKurOkuYenilemeSuresiMs: number
    dbFiyatAcikKapali: number
    dbKurLogYenilemeSuresiMs: number
    kurLogList: unknown[]
    kurLogUpdateTarih: string
}

export interface GrupList {
    grupId: number
    ad: string
    sira: number
    mobilGoster: number
}

export interface GrupPariteList {
    grupPariteId: number
    grupId: number
    parite: string
    sira: number
}

export interface KurList {
    kurId: number
    parite: string
    tarih: string
    alis: number
    satis: number
    satisFiyatSecim: number
    alisMarjMilyem: number
    satisMarjMilyem: number
    alisMarj: number
    satisMarj: number
    alisEkran: number
    satisEkran: number
    birim: string
    fark: number
    sira: number
    marjBolum: number
    baslik?: string
    ondalik: number
}
