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
      Address: {
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
            foreignKeyName: "Address_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
        ]
      }
      AddressHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          Adress: string | null
          adressId: string | null
          changeDate: string
          Country: string | null
          customerId: string | null
          District: string | null
          id: string
          Neighbour: string | null
          PhoneNumber: string | null
          Province: string | null
          Type: Database["public"]["Enums"]["AdressType"]
          updatedBy: string | null
          ZipCode: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          Adress?: string | null
          adressId?: string | null
          changeDate?: string
          Country?: string | null
          customerId?: string | null
          District?: string | null
          id: string
          Neighbour?: string | null
          PhoneNumber?: string | null
          Province?: string | null
          Type: Database["public"]["Enums"]["AdressType"]
          updatedBy?: string | null
          ZipCode?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          Adress?: string | null
          adressId?: string | null
          changeDate?: string
          Country?: string | null
          customerId?: string | null
          District?: string | null
          id?: string
          Neighbour?: string | null
          PhoneNumber?: string | null
          Province?: string | null
          Type?: Database["public"]["Enums"]["AdressType"]
          updatedBy?: string | null
          ZipCode?: string | null
        }
        Relationships: []
      }
      Customer: {
        Row: {
          companyName: string | null
          connectedDealerId: string | null
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
            referencedRelation: "Org"
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
      CustomerHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          companyName: string | null
          connectedDealerId: string | null
          customerId: string | null
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
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          companyName?: string | null
          connectedDealerId?: string | null
          customerId?: string | null
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
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          companyName?: string | null
          connectedDealerId?: string | null
          customerId?: string | null
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
          updatedBy?: string | null
        }
        Relationships: []
      }
      DealerRelation: {
        Row: {
          dealerId: string
          id: string
          parentOrgId: string
        }
        Insert: {
          dealerId: string
          id: string
          parentOrgId: string
        }
        Update: {
          dealerId?: string
          id?: string
          parentOrgId?: string
        }
        Relationships: [
          {
            foreignKeyName: "DealerRelation_dealerId_fkey"
            columns: ["dealerId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DealerRelation_parentOrgId_fkey"
            columns: ["parentOrgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      DealerRelationHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          dealerId: string
          dealerRelationId: string | null
          id: string
          parentOrgId: string
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          dealerId: string
          dealerRelationId?: string | null
          id: string
          parentOrgId: string
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          dealerId?: string
          dealerRelationId?: string | null
          id?: string
          parentOrgId?: string
          updatedBy?: string | null
        }
        Relationships: []
      }
      DealerView: {
        Row: {
          id: string
          itemId: string
          orgId: string
          stock: number
        }
        Insert: {
          id: string
          itemId: string
          orgId: string
          stock: number
        }
        Update: {
          id?: string
          itemId?: string
          orgId?: string
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "DealerView_itemId_fkey"
            columns: ["itemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DealerView_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      DealerViewHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          dealerViewId: string | null
          id: string
          itemId: string
          orgId: string
          stock: number
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          dealerViewId?: string | null
          id: string
          itemId: string
          orgId: string
          stock: number
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          dealerViewId?: string | null
          id?: string
          itemId?: string
          orgId?: string
          stock?: number
          updatedBy?: string | null
        }
        Relationships: []
      }
      Item: {
        Row: {
          createDate: string
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
          netWeight: number | null
          orgId: string
          serviceItemList: string[] | null
          shelfBoxId: string | null
          shelfId: string | null
          singlePrice: number | null
          updateDate: string
          volume: number | null
        }
        Insert: {
          createDate?: string
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
          netWeight?: number | null
          orgId: string
          serviceItemList?: string[] | null
          shelfBoxId?: string | null
          shelfId?: string | null
          singlePrice?: number | null
          updateDate: string
          volume?: number | null
        }
        Update: {
          createDate?: string
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
          netWeight?: number | null
          orgId?: string
          serviceItemList?: string[] | null
          shelfBoxId?: string | null
          shelfId?: string | null
          singlePrice?: number | null
          updateDate?: string
          volume?: number | null
        }
        Relationships: [
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
          id: string
          itemAcceptHistoryId: string | null
          itemBarcodeId: string
          itemId: string
          orgId: string | null
          quantity: number
        }
        Insert: {
          id: string
          itemAcceptHistoryId?: string | null
          itemBarcodeId: string
          itemId: string
          orgId?: string | null
          quantity: number
        }
        Update: {
          id?: string
          itemAcceptHistoryId?: string | null
          itemBarcodeId?: string
          itemId?: string
          orgId?: string | null
          quantity?: number
        }
        Relationships: [
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
          id: string
          name: string
          orgId: string | null
          storageId: string
        }
        Insert: {
          createDate?: string
          customerId: string
          id: string
          name: string
          orgId?: string | null
          storageId: string
        }
        Update: {
          createDate?: string
          customerId?: string
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
      itemBarcodeHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          barcode: string
          changeDate: string
          id: string
          isMaster: boolean
          itemBarcodeId: string | null
          quantity: number
          unit: string
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          barcode: string
          changeDate?: string
          id: string
          isMaster: boolean
          itemBarcodeId?: string | null
          quantity: number
          unit: string
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          barcode?: string
          changeDate?: string
          id?: string
          isMaster?: boolean
          itemBarcodeId?: string | null
          quantity?: number
          unit?: string
          updatedBy?: string | null
        }
        Relationships: []
      }
      ItemBrand: {
        Row: {
          id: string
          name: string
          orgId: string | null
        }
        Insert: {
          id: string
          name: string
          orgId?: string | null
        }
        Update: {
          id?: string
          name?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ItemBrand_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemBrandHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: string
          itemBrandId: string | null
          name: string
          orgId: string | null
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id: string
          itemBrandId?: string | null
          name: string
          orgId?: string | null
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: string
          itemBrandId?: string | null
          name?: string
          orgId?: string | null
          updatedBy?: string | null
        }
        Relationships: []
      }
      ItemCategory: {
        Row: {
          id: string
          name: string
          orgId: string | null
        }
        Insert: {
          id: string
          name: string
          orgId?: string | null
        }
        Update: {
          id?: string
          name?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ItemCategory_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemCategoryHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: string
          itemCategoryId: string | null
          name: string
          orgId: string | null
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id: string
          itemCategoryId?: string | null
          name: string
          orgId?: string | null
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: string
          itemCategoryId?: string | null
          name?: string
          orgId?: string | null
          updatedBy?: string | null
        }
        Relationships: []
      }
      ItemColor: {
        Row: {
          colorCode: string
          colorText: string
          id: string
          orgId: string | null
        }
        Insert: {
          colorCode: string
          colorText: string
          id: string
          orgId?: string | null
        }
        Update: {
          colorCode?: string
          colorText?: string
          id?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ItemColor_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemColorHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          colorCode: string
          colorText: string
          id: string
          itemColorId: string | null
          orgId: string | null
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          colorCode: string
          colorText: string
          id: string
          itemColorId?: string | null
          orgId?: string | null
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          colorCode?: string
          colorText?: string
          id?: string
          itemColorId?: string | null
          orgId?: string | null
          updatedBy?: string | null
        }
        Relationships: []
      }
      ItemHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
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
          netWeight: number | null
          orgId: string
          serviceItemList: string[] | null
          shelfBoxId: string | null
          shelfId: string | null
          singlePrice: number | null
          updatedBy: string | null
          updatedItemId: string | null
          volume: number | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
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
          netWeight?: number | null
          orgId: string
          serviceItemList?: string[] | null
          shelfBoxId?: string | null
          shelfId?: string | null
          singlePrice?: number | null
          updatedBy?: string | null
          updatedItemId?: string | null
          volume?: number | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
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
          netWeight?: number | null
          orgId?: string
          serviceItemList?: string[] | null
          shelfBoxId?: string | null
          shelfId?: string | null
          singlePrice?: number | null
          updatedBy?: string | null
          updatedItemId?: string | null
          volume?: number | null
        }
        Relationships: []
      }
      ItemRelation: {
        Row: {
          id: string
          parentItemId: string | null
          serviceItemId: string | null
        }
        Insert: {
          id: string
          parentItemId?: string | null
          serviceItemId?: string | null
        }
        Update: {
          id?: string
          parentItemId?: string | null
          serviceItemId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ItemRelation_parentItemId_fkey"
            columns: ["parentItemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ItemRelation_serviceItemId_fkey"
            columns: ["serviceItemId"]
            isOneToOne: false
            referencedRelation: "Item"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemSize: {
        Row: {
          id: string
          orgId: string | null
          sizeCode: string
          sizeText: string
        }
        Insert: {
          id: string
          orgId?: string | null
          sizeCode: string
          sizeText: string
        }
        Update: {
          id?: string
          orgId?: string | null
          sizeCode?: string
          sizeText?: string
        }
        Relationships: [
          {
            foreignKeyName: "ItemSize_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      ItemSizeHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: string
          itemSizeId: string | null
          orgId: string | null
          sizeCode: string
          sizeText: string
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id: string
          itemSizeId?: string | null
          orgId?: string | null
          sizeCode: string
          sizeText: string
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: string
          itemSizeId?: string | null
          orgId?: string | null
          sizeCode?: string
          sizeText?: string
          updatedBy?: string | null
        }
        Relationships: []
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
      ItemStockHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: number
          itemId: string
          itemStockId: string | null
          stock: number
          storageId: string
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: never
          itemId: string
          itemStockId?: string | null
          stock: number
          storageId: string
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: never
          itemId?: string
          itemStockId?: string | null
          stock?: number
          storageId?: string
          updatedBy?: string | null
        }
        Relationships: []
      }
      Member: {
        Row: {
          id: string
          orgId: string | null
          uid: string | null
          userEmail: string
        }
        Insert: {
          id: string
          orgId?: string | null
          uid?: string | null
          userEmail: string
        }
        Update: {
          id?: string
          orgId?: string | null
          uid?: string | null
          userEmail?: string
        }
        Relationships: [
          {
            foreignKeyName: "Member_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      MemberHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: string
          memberId: string | null
          orgId: string | null
          uid: string | null
          updatedBy: string | null
          userEmail: string
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id: string
          memberId?: string | null
          orgId?: string | null
          uid?: string | null
          updatedBy?: string | null
          userEmail: string
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: string
          memberId?: string | null
          orgId?: string | null
          uid?: string | null
          updatedBy?: string | null
          userEmail?: string
        }
        Relationships: []
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
          id: string
          name: string
          orgId: string | null
        }
        Insert: {
          id: string
          name: string
          orgId?: string | null
        }
        Update: {
          id?: string
          name?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "MemberRole_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      MemberRoleHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changedate: string
          id: number
          memberPermissions: string[] | null
          name: string
          orgId: string | null
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changedate?: string
          id?: number
          memberPermissions?: string[] | null
          name: string
          orgId?: string | null
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changedate?: string
          id?: number
          memberPermissions?: string[] | null
          name?: string
          orgId?: string | null
          updatedBy?: string | null
        }
        Relationships: []
      }
      Org: {
        Row: {
          id: string
          name: string
          priceType: Database["public"]["Enums"]["PriceType"]
          type: Database["public"]["Enums"]["OrgType"]
        }
        Insert: {
          id: string
          name: string
          priceType?: Database["public"]["Enums"]["PriceType"]
          type?: Database["public"]["Enums"]["OrgType"]
        }
        Update: {
          id?: string
          name?: string
          priceType?: Database["public"]["Enums"]["PriceType"]
          type?: Database["public"]["Enums"]["OrgType"]
        }
        Relationships: []
      }
      OrgHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: string
          name: string
          orgId: string | null
          type: Database["public"]["Enums"]["OrgType"]
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id: string
          name: string
          orgId?: string | null
          type: Database["public"]["Enums"]["OrgType"]
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: string
          name?: string
          orgId?: string | null
          type?: Database["public"]["Enums"]["OrgType"]
          updatedBy?: string | null
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
      ShelfBoxHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: string
          name: string | null
          shelfBoxId: string | null
          shelfId: string | null
          storageId: string
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id: string
          name?: string | null
          shelfBoxId?: string | null
          shelfId?: string | null
          storageId: string
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: string
          name?: string | null
          shelfBoxId?: string | null
          shelfId?: string | null
          storageId?: string
          updatedBy?: string | null
        }
        Relationships: []
      }
      ShelfHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: string
          name: string | null
          shelfId: string | null
          storageId: string
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id: string
          name?: string | null
          shelfId?: string | null
          storageId: string
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: string
          name?: string | null
          shelfId?: string | null
          storageId?: string
          updatedBy?: string | null
        }
        Relationships: []
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
      ShelfItemDetailHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: string
          itemId: string
          quantity: number
          shelfBoxId: string | null
          shelfId: string | null
          shelfItemDetailId: string | null
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id: string
          itemId: string
          quantity: number
          shelfBoxId?: string | null
          shelfId?: string | null
          shelfItemDetailId?: string | null
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: string
          itemId?: string
          quantity?: number
          shelfBoxId?: string | null
          shelfId?: string | null
          shelfItemDetailId?: string | null
          updatedBy?: string | null
        }
        Relationships: []
      }
      Storage: {
        Row: {
          id: string
          name: string
          orgId: string | null
        }
        Insert: {
          id: string
          name: string
          orgId?: string | null
        }
        Update: {
          id?: string
          name?: string
          orgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Storage_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      StorageHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          id: string
          name: string
          orgId: string | null
          storageId: string | null
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id: string
          name: string
          orgId?: string | null
          storageId?: string | null
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          id?: string
          name?: string
          orgId?: string | null
          storageId?: string | null
          updatedBy?: string | null
        }
        Relationships: []
      }
      Transaction: {
        Row: {
          createDate: string
          customerId: string
          discount: string | null
          exchangeRate: string | null
          id: string
          memberId: string | null
          orgId: string | null
          payAmount: string | null
          priceType: Database["public"]["Enums"]["PriceType"] | null
          storageId: string
          totalAmount: string | null
          transactionType: Database["public"]["Enums"]["transactionType"]
          transferredDealerId: string | null
          updatedAt: string
        }
        Insert: {
          createDate?: string
          customerId: string
          discount?: string | null
          exchangeRate?: string | null
          id: string
          memberId?: string | null
          orgId?: string | null
          payAmount?: string | null
          priceType?: Database["public"]["Enums"]["PriceType"] | null
          storageId: string
          totalAmount?: string | null
          transactionType: Database["public"]["Enums"]["transactionType"]
          transferredDealerId?: string | null
          updatedAt: string
        }
        Update: {
          createDate?: string
          customerId?: string
          discount?: string | null
          exchangeRate?: string | null
          id?: string
          memberId?: string | null
          orgId?: string | null
          payAmount?: string | null
          priceType?: Database["public"]["Enums"]["PriceType"] | null
          storageId?: string
          totalAmount?: string | null
          transactionType?: Database["public"]["Enums"]["transactionType"]
          transferredDealerId?: string | null
          updatedAt?: string
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
            foreignKeyName: "Transaction_memberId_fkey"
            columns: ["memberId"]
            isOneToOne: false
            referencedRelation: "Member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transaction_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transaction_storageId_fkey"
            columns: ["storageId"]
            isOneToOne: false
            referencedRelation: "Storage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Transaction_transferredDealerId_fkey"
            columns: ["transferredDealerId"]
            isOneToOne: false
            referencedRelation: "Org"
            referencedColumns: ["id"]
          },
        ]
      }
      TransactionHistory: {
        Row: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate: string
          discount: string | null
          exchangeRate: string | null
          id: string
          payAmount: string | null
          priceType: Database["public"]["Enums"]["PriceType"] | null
          totalAmount: string | null
          transactionType: Database["public"]["Enums"]["transactionType"]
          updatedBy: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          discount?: string | null
          exchangeRate?: string | null
          id: string
          payAmount?: string | null
          priceType?: Database["public"]["Enums"]["PriceType"] | null
          totalAmount?: string | null
          transactionType: Database["public"]["Enums"]["transactionType"]
          updatedBy?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_actions"]
          changeDate?: string
          discount?: string | null
          exchangeRate?: string | null
          id?: string
          payAmount?: string | null
          priceType?: Database["public"]["Enums"]["PriceType"] | null
          totalAmount?: string | null
          transactionType?: Database["public"]["Enums"]["transactionType"]
          updatedBy?: string | null
        }
        Relationships: []
      }
      TransactionItemDetail: {
        Row: {
          customerPrice: string | null
          customerTransactionId: string
          dealerPrice: string | null
          id: string
          itemId: string
          quantity: number
          serialNumbers: string[] | null
        }
        Insert: {
          customerPrice?: string | null
          customerTransactionId: string
          dealerPrice?: string | null
          id: string
          itemId: string
          quantity: number
          serialNumbers?: string[] | null
        }
        Update: {
          customerPrice?: string | null
          customerTransactionId?: string
          dealerPrice?: string | null
          id?: string
          itemId?: string
          quantity?: number
          serialNumbers?: string[] | null
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
          user_email: string
        }
        Returns: {
          permission_id: string
          permission_name: string
          permission_description: string
        }[]
      }
    }
    Enums: {
      AdressType: "Normal" | "Billing" | "Shipping"
      audit_actions: "INSERT" | "UPDATE" | "DELETE"
      MemberType: "Dealer" | "Organization"
      OrgType: "Org" | "Dealer"
      PriceType:
        | "mainDealerPrice"
        | "dealerPrice"
        | "multiPrice"
        | "singlePrice"
        | "org"
      transactionType: "Sale" | "Accept" | "Cancel" | "Return" | "Count"
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
