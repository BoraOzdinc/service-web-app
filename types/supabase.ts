export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _MemberPermissionToMemberRole: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_MemberPermissionToMemberRole_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "MemberPermission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_MemberPermissionToMemberRole_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "MemberRole"
            referencedColumns: ["id"]
          },
        ]
      }
      _MemberToMemberRole: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_MemberToMemberRole_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_MemberToMemberRole_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "MemberRole"
            referencedColumns: ["id"]
          },
        ]
      }
      Adress: {
        Row: {
          Adress: string | null
          Country: string | null
          customerId: string | null
          District: string | null
          id: string
          Neighbour: string | null
          PhoneNumber: string | null
          Province: string | null
          Type: Database["public"]["Enums"]["AdressType"]
          ZipCode: string | null
        }
        Insert: {
          Adress?: string | null
          Country?: string | null
          customerId?: string | null
          District?: string | null
          id: string
          Neighbour?: string | null
          PhoneNumber?: string | null
          Province?: string | null
          Type: Database["public"]["Enums"]["AdressType"]
          ZipCode?: string | null
        }
        Update: {
          Adress?: string | null
          Country?: string | null
          customerId?: string | null
          District?: string | null
          id?: string
          Neighbour?: string | null
          PhoneNumber?: string | null
          Province?: string | null
          Type?: Database["public"]["Enums"]["AdressType"]
          ZipCode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Adress_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
        ]
      }
      Customer: {
        Row: {
          companyName: string | null
          connectedDealerId: string | null
          dealerId: string | null
          email: string
          id: string
          identificationNo: string | null
          name: string
          orgId: string | null
          phoneNumber: string
          priceType: Database["public"]["Enums"]["PriceType"]
          surname: string
          taxDep: string | null
          taxNumber: string | null
        }
        Insert: {
          companyName?: string | null
          connectedDealerId?: string | null
          dealerId?: string | null
          email: string
          id: string
          identificationNo?: string | null
          name: string
          orgId?: string | null
          phoneNumber: string
          priceType: Database["public"]["Enums"]["PriceType"]
          surname: string
          taxDep?: string | null
          taxNumber?: string | null
        }
        Update: {
          companyName?: string | null
          connectedDealerId?: string | null
          dealerId?: string | null
          email?: string
          id?: string
          identificationNo?: string | null
          name?: string
          orgId?: string | null
          phoneNumber?: string
          priceType?: Database["public"]["Enums"]["PriceType"]
          surname?: string
          taxDep?: string | null
          taxNumber?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Customer_connectedDealerId_fkey"
            columns: ["connectedDealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Customer_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Customer_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      Dealer: {
        Row: {
          id: string
          name: string
          orgId: string
          priceType: Database["public"]["Enums"]["PriceType"]
        }
        Insert: {
          id: string
          name: string
          orgId: string
          priceType: Database["public"]["Enums"]["PriceType"]
        }
        Update: {
          id?: string
          name?: string
          orgId?: string
          priceType?: Database["public"]["Enums"]["PriceType"]
        }
        Relationships: [
          {
            foreignKeyName: "Dealer_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      DealerView: {
        Row: {
          dealerId: string
          id: string
          itemId: string
          stock: number
        }
        Insert: {
          dealerId: string
          id: string
          itemId: string
          stock: number
        }
        Update: {
          dealerId?: string
          id?: string
          itemId?: string
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "DealerView_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DealerView_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
        ]
      }
      Item: {
        Row: {
          createDate: string
          dealerId: string | null
          dealerPrice: number | null
          id: string
          image: string | null
          isSerialNoRequired: boolean
          isServiceItem: boolean
          itemBrandId: string
          itemCategoryId: string
          itemCode: string
          itemColorId: string
          itemSizeId: string
          mainDealerPrice: number | null
          multiPrice: number | null
          name: string
          netWeight: string | null
          orgId: string | null
          shelfBoxId: string | null
          shelfId: string | null
          singlePrice: number | null
          updateDate: string
          volume: string | null
        }
        Insert: {
          createDate?: string
          dealerId?: string | null
          dealerPrice?: number | null
          id: string
          image?: string | null
          isSerialNoRequired: boolean
          isServiceItem: boolean
          itemBrandId: string
          itemCategoryId: string
          itemCode: string
          itemColorId: string
          itemSizeId: string
          mainDealerPrice?: number | null
          multiPrice?: number | null
          name: string
          netWeight?: string | null
          orgId?: string | null
          shelfBoxId?: string | null
          shelfId?: string | null
          singlePrice?: number | null
          updateDate: string
          volume?: string | null
        }
        Update: {
          createDate?: string
          dealerId?: string | null
          dealerPrice?: number | null
          id?: string
          image?: string | null
          isSerialNoRequired?: boolean
          isServiceItem?: boolean
          itemBrandId?: string
          itemCategoryId?: string
          itemCode?: string
          itemColorId?: string
          itemSizeId?: string
          mainDealerPrice?: number | null
          multiPrice?: number | null
          name?: string
          netWeight?: string | null
          orgId?: string | null
          shelfBoxId?: string | null
          shelfId?: string | null
          singlePrice?: number | null
          updateDate?: string
          volume?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Item_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Item_itemBrandId_fkey"
            columns: ["itemBrandId"]
            isOneToOne: false
            referencedRelation: "ItemBrand"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Item_itemCategoryId_fkey"
            columns: ["itemCategoryId"]
            isOneToOne: false
            referencedRelation: "ItemCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Item_itemColorId_fkey"
            columns: ["itemColorId"]
            isOneToOne: false
            referencedRelation: "ItemColor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Item_itemSizeId_fkey"
            columns: ["itemSizeId"]
            isOneToOne: false
            referencedRelation: "ItemSize"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Item_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemAcceptDetail: {
        Row: {
          dealerId: string | null
          id: string
          itemAcceptHistoryId: string | null
          itemBarcodeId: string
          itemId: string
          orgId: string | null
          quantity: number
        }
        Insert: {
          dealerId?: string | null
          id: string
          itemAcceptHistoryId?: string | null
          itemBarcodeId: string
          itemId: string
          orgId?: string | null
          quantity: number
        }
        Update: {
          dealerId?: string | null
          id?: string
          itemAcceptHistoryId?: string | null
          itemBarcodeId?: string
          itemId?: string
          orgId?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "ItemAcceptDetail_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemAcceptDetail_itemAcceptHistoryId_fkey"
            columns: ["itemAcceptHistoryId"]
            isOneToOne: false
            referencedRelation: "ItemAcceptHistory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemAcceptDetail_itemBarcodeId_fkey"
            columns: ["itemBarcodeId"]
            isOneToOne: false
            referencedRelation: "itemBarcode"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemAcceptDetail_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemAcceptDetail_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemAcceptHistory: {
        Row: {
          createDate: string
          customerId: string
          dealerId: string | null
          id: string
          name: string
          orgId: string | null
          storageId: string
        }
        Insert: {
          createDate?: string
          customerId: string
          dealerId?: string | null
          id: string
          name: string
          orgId?: string | null
          storageId: string
        }
        Update: {
          createDate?: string
          customerId?: string
          dealerId?: string | null
          id?: string
          name?: string
          orgId?: string | null
          storageId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ItemAcceptHistory_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemAcceptHistory_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemAcceptHistory_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemAcceptHistory_storageId_fkey"
            columns: ["storageId"]
            isOneToOne: false
            referencedRelation: "Storage"
            referencedColumns: ["id"]
          },
        ]
      }
      itemBarcode: {
        Row: {
          barcode: string
          id: string
          isMaster: boolean
          itemId: string
          quantity: number
          unit: string
        }
        Insert: {
          barcode: string
          id: string
          isMaster: boolean
          itemId: string
          quantity: number
          unit: string
        }
        Update: {
          barcode?: string
          id?: string
          isMaster?: boolean
          itemId?: string
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "itemBarcode_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemBrand: {
        Row: {
          dealerId: string | null
          id: string
          name: string
          orgId: string | null
        }
        Insert: {
          dealerId?: string | null
          id: string
          name: string
          orgId?: string | null
        }
        Update: {
          dealerId?: string | null
          id?: string
          name?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ItemBrand_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemBrand_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemCategory: {
        Row: {
          dealerId: string | null
          id: string
          name: string
          orgId: string | null
        }
        Insert: {
          dealerId?: string | null
          id: string
          name: string
          orgId?: string | null
        }
        Update: {
          dealerId?: string | null
          id?: string
          name?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ItemCategory_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemCategory_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemColor: {
        Row: {
          colorCode: string
          colorText: string
          dealerId: string | null
          id: string
          orgId: string | null
        }
        Insert: {
          colorCode: string
          colorText: string
          dealerId?: string | null
          id: string
          orgId?: string | null
        }
        Update: {
          colorCode?: string
          colorText?: string
          dealerId?: string | null
          id?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ItemColor_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemColor_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemHistory: {
        Row: {
          action: Database["public"]["Enums"]["ItemHistoryActions"]
          createDate: string
          createdBy: string
          dealerId: string | null
          description: string
          fromStorageId: string | null
          id: string
          itemId: string
          orgId: string | null
          quantity: number
          toStorageId: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["ItemHistoryActions"]
          createDate?: string
          createdBy: string
          dealerId?: string | null
          description: string
          fromStorageId?: string | null
          id: string
          itemId: string
          orgId?: string | null
          quantity: number
          toStorageId?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["ItemHistoryActions"]
          createDate?: string
          createdBy?: string
          dealerId?: string | null
          description?: string
          fromStorageId?: string | null
          id?: string
          itemId?: string
          orgId?: string | null
          quantity?: number
          toStorageId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ItemHistory_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemHistory_fromStorageId_fkey"
            columns: ["fromStorageId"]
            isOneToOne: false
            referencedRelation: "Storage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemHistory_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemHistory_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemHistory_toStorageId_fkey"
            columns: ["toStorageId"]
            isOneToOne: false
            referencedRelation: "Storage"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemSellDetail: {
        Row: {
          id: string
          itemAcceptHistoryId: string | null
          itemId: string
          quantity: number
          serialNumbers: string[] | null
        }
        Insert: {
          id: string
          itemAcceptHistoryId?: string | null
          itemId: string
          quantity: number
          serialNumbers?: string[] | null
        }
        Update: {
          id?: string
          itemAcceptHistoryId?: string | null
          itemId?: string
          quantity?: number
          serialNumbers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "ItemSellDetail_itemAcceptHistoryId_fkey"
            columns: ["itemAcceptHistoryId"]
            isOneToOne: false
            referencedRelation: "ItemSellHistory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemSellDetail_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemSellHistory: {
        Row: {
          createDate: string
          customerId: string
          dealerId: string | null
          id: string
          name: string
          orgId: string | null
          storageId: string
          transactionId: string
          transactionType: Database["public"]["Enums"]["transactionType"]
        }
        Insert: {
          createDate?: string
          customerId: string
          dealerId?: string | null
          id: string
          name: string
          orgId?: string | null
          storageId: string
          transactionId: string
          transactionType: Database["public"]["Enums"]["transactionType"]
        }
        Update: {
          createDate?: string
          customerId?: string
          dealerId?: string | null
          id?: string
          name?: string
          orgId?: string | null
          storageId?: string
          transactionId?: string
          transactionType?: Database["public"]["Enums"]["transactionType"]
        }
        Relationships: [
          {
            foreignKeyName: "ItemSellHistory_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemSellHistory_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemSellHistory_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemSellHistory_storageId_fkey"
            columns: ["storageId"]
            isOneToOne: false
            referencedRelation: "Storage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemSellHistory_transactionId_fkey"
            columns: ["transactionId"]
            isOneToOne: false
            referencedRelation: "Transaction"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemSize: {
        Row: {
          dealerId: string | null
          id: string
          orgId: string | null
          sizeCode: string
          sizeText: string
        }
        Insert: {
          dealerId?: string | null
          id: string
          orgId?: string | null
          sizeCode: string
          sizeText: string
        }
        Update: {
          dealerId?: string | null
          id?: string
          orgId?: string | null
          sizeCode?: string
          sizeText?: string
        }
        Relationships: [
          {
            foreignKeyName: "ItemSize_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemSize_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemStock: {
        Row: {
          id: string
          itemId: string
          stock: number
          storageId: string
        }
        Insert: {
          id: string
          itemId: string
          stock: number
          storageId: string
        }
        Update: {
          id?: string
          itemId?: string
          stock?: number
          storageId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ItemStock_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemStock_storageId_fkey"
            columns: ["storageId"]
            isOneToOne: false
            referencedRelation: "Storage"
            referencedColumns: ["id"]
          },
        ]
      }
      Member: {
        Row: {
          dealerId: string | null
          id: string
          orgId: string | null
          uid: string | null
          userEmail: string
        }
        Insert: {
          dealerId?: string | null
          id: string
          orgId?: string | null
          uid?: string | null
          userEmail: string
        }
        Update: {
          dealerId?: string | null
          id?: string
          orgId?: string | null
          uid?: string | null
          userEmail?: string
        }
        Relationships: [
          {
            foreignKeyName: "Member_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Member_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      MemberPermission: {
        Row: {
          assignableTo: Database["public"]["Enums"]["MemberType"][] | null
          description: string
          id: string
          name: string
        }
        Insert: {
          assignableTo?: Database["public"]["Enums"]["MemberType"][] | null
          description: string
          id: string
          name: string
        }
        Update: {
          assignableTo?: Database["public"]["Enums"]["MemberType"][] | null
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      MemberRole: {
        Row: {
          dealerId: string | null
          id: string
          name: string
          orgId: string | null
        }
        Insert: {
          dealerId?: string | null
          id: string
          name: string
          orgId?: string | null
        }
        Update: {
          dealerId?: string | null
          id?: string
          name?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "MemberRole_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MemberRole_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      Org: {
        Row: {
          id: string
          orgName: string
        }
        Insert: {
          id: string
          orgName: string
        }
        Update: {
          id?: string
          orgName?: string
        }
        Relationships: []
      }
      Shelf: {
        Row: {
          createDate: string
          id: string
          name: string | null
          storageId: string
          updateDate: string
        }
        Insert: {
          createDate?: string
          id: string
          name?: string | null
          storageId: string
          updateDate: string
        }
        Update: {
          createDate?: string
          id?: string
          name?: string | null
          storageId?: string
          updateDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "Shelf_storageId_fkey"
            columns: ["storageId"]
            isOneToOne: false
            referencedRelation: "Storage"
            referencedColumns: ["id"]
          },
        ]
      }
      ShelfBox: {
        Row: {
          createDate: string
          id: string
          name: string | null
          shelfId: string | null
          storageId: string
          updateDate: string
        }
        Insert: {
          createDate?: string
          id: string
          name?: string | null
          shelfId?: string | null
          storageId: string
          updateDate: string
        }
        Update: {
          createDate?: string
          id?: string
          name?: string | null
          shelfId?: string | null
          storageId?: string
          updateDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "ShelfBox_shelfId_fkey"
            columns: ["shelfId"]
            isOneToOne: false
            referencedRelation: "Shelf"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ShelfBox_storageId_fkey"
            columns: ["storageId"]
            isOneToOne: false
            referencedRelation: "Storage"
            referencedColumns: ["id"]
          },
        ]
      }
      ShelfItemDetail: {
        Row: {
          createDate: string
          id: string
          itemId: string
          quantity: number
          shelfBoxId: string | null
          shelfId: string | null
          updateDate: string
        }
        Insert: {
          createDate?: string
          id: string
          itemId: string
          quantity: number
          shelfBoxId?: string | null
          shelfId?: string | null
          updateDate: string
        }
        Update: {
          createDate?: string
          id?: string
          itemId?: string
          quantity?: number
          shelfBoxId?: string | null
          shelfId?: string | null
          updateDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "ShelfItemDetail_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ShelfItemDetail_shelfBoxId_fkey"
            columns: ["shelfBoxId"]
            isOneToOne: false
            referencedRelation: "ShelfBox"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ShelfItemDetail_shelfId_fkey"
            columns: ["shelfId"]
            isOneToOne: false
            referencedRelation: "Shelf"
            referencedColumns: ["id"]
          },
        ]
      }
      Storage: {
        Row: {
          dealerId: string | null
          id: string
          name: string
          orgId: string | null
        }
        Insert: {
          dealerId?: string | null
          id: string
          name: string
          orgId?: string | null
        }
        Update: {
          dealerId?: string | null
          id?: string
          name?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Storage_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Storage_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      Transaction: {
        Row: {
          createDate: string
          customerId: string
          dealerId: string | null
          discount: string
          exchangeRate: string
          id: string
          payAmount: string
          priceType: Database["public"]["Enums"]["PriceType"]
          storageId: string
          totalAmount: string
          transactionType: Database["public"]["Enums"]["transactionType"]
        }
        Insert: {
          createDate?: string
          customerId: string
          dealerId?: string | null
          discount: string
          exchangeRate: string
          id: string
          payAmount: string
          priceType: Database["public"]["Enums"]["PriceType"]
          storageId: string
          totalAmount: string
          transactionType: Database["public"]["Enums"]["transactionType"]
        }
        Update: {
          createDate?: string
          customerId?: string
          dealerId?: string | null
          discount?: string
          exchangeRate?: string
          id?: string
          payAmount?: string
          priceType?: Database["public"]["Enums"]["PriceType"]
          storageId?: string
          totalAmount?: string
          transactionType?: Database["public"]["Enums"]["transactionType"]
        }
        Relationships: [
          {
            foreignKeyName: "Transaction_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transaction_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Dealer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transaction_storageId_fkey"
            columns: ["storageId"]
            isOneToOne: false
            referencedRelation: "Storage"
            referencedColumns: ["id"]
          },
        ]
      }
      TransactionItemDetail: {
        Row: {
          customerTransactionId: string | null
          id: string
          itemId: string
          price: string | null
          quantity: number
        }
        Insert: {
          customerTransactionId?: string | null
          id: string
          itemId: string
          price?: string | null
          quantity: number
        }
        Update: {
          customerTransactionId?: string | null
          id?: string
          itemId?: string
          price?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "TransactionItemDetail_customerTransactionId_fkey"
            columns: ["customerTransactionId"]
            isOneToOne: false
            referencedRelation: "Transaction"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TransactionItemDetail_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_permissions: {
        Args: {
          inputemail: string
        }
        Returns: {
          orgid: string
          dealerid: string
          useremail: string
          permission_name: string
        }[]
      }
    }
    Enums: {
      AdressType: "Normal" | "Billing" | "Shipping"
      ItemHistoryActions: "AddItem" | "UpdateItem" | "DeleteItem"
      MemberType: "Dealer" | "Organization"
      PriceType:
        | "mainDealerPrice"
        | "dealerPrice"
        | "multiPrice"
        | "singlePrice"
      transactionType: "Sale" | "Cancel" | "Return"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
