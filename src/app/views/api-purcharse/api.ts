export class Api {

    //public URL: string = "http://localhost:808/api/purcharse_request/";
    public URL: string = "http://localhost/api/purcharse_request/";
    public _method: string = '';
    public data: {};

    private URL_DATA = {
        "GET_USERS":
        {
            "url": this.URL + "GET",
            "data":
            {
                'qr': 'user'
                /*'id': ''*/
            }
        },
        "SAVE_USER":
        {
            "url": this.URL + "GET",
            "data":
            {
                _id:"",
                name: "",
                lastname: "",
                username: "",
                password: "",
                email: "",
                user_type_id: "",
                state: "",
                ta: "users",
                qr: "save"
            }
        },
        "GET_USER_TYPE":
        {
            "url": this.URL + "GET",
            "data":
            {
                'qr': 'userty'
                /*'id': ''*/
            }
        },
        "GET_ORDERS":
        {
            "url": this.URL + "GET",
            "data": { 'qr': 'orders' }
        },
        "GET_ORDERS_PEND":
        {
            "url": this.URL + "GET",
            "data": {
                qr: "inquiries",
                co: "inquirie",
                status: 0,
                is_process: false,
                is_pendi_input: false,
                toUrl: true,
                toDelete: false,
                Delete: true,
                ta: "products"
            }
        },
        "GET_ORDERS_APROBADAS":
        {
            "url": this.URL + "GET",
            "data": {
                qr: "inquiries",
                co: "inquirie",
                status: "1,6",
                is_process: false,
                is_pendi_input: false,
                toUrl: true,
                toDelete: false
            }
        },
        "NEXT_ORDER": {
            "url": this.URL + "GET",
            "data": {
                qr: "nextPurcharse",
                co: "nextPurc"
            }
        },
        "GET_APROBERS": {
            "url": this.URL + "GET",
            "data": {
                qr: "Approve"
            }
        },
        "GET_CENTERS_COSTE": {
            "url": this.URL + "GET",
            "data": {
                "isq": false,
                "qr": "",
                "co": 'getcostCenter'
            }
        },
        "GET_CODE_WO": {
            "url": this.URL + "GET",
            "data": {
                "qr": "_all",
                "item": "",
                "ta": "Sync_products"
            }
        },
        "ALL_PRODUCTS_TEMP": {
            "url": this.URL + "GET",
            "data": {
                "purchase_request_id": "",
                "qr": "_all",
                "ta": "temp_products"
            }
        },
        "SAVE_PRODUCT_TEMP": {
            "url": this.URL + "SET",
            "data": {
                "fomplus_code": 0,
                "description": "",
                "manufacturer": "",
                "part_number": "",
                "provider": "",
                "pn_provider": "",
                "qty": 0,
                "cost_centre": "",
                "priority_id": 0,
                "limit_date": "",
                "comments": "",
                "purchase_request_id": "",
                "qr": "save",
                "ta": "temp_products"
            }
        },
        "REMOVE_PRODUCT_TEMP": {
            "url": this.URL + "UNSETT",
            "data": {
                "qr": "delete",
                "ta": "temp_products",
                "in": 0
            }
        },
        "GET_PRODUCT_TEMP": {
            "url": this.URL + "GET",
            "data": {
                "qr": "_all",
                "ta": "temp_products",
                "id": 0
            }
        },
        "UPLOAD_PRODUCTS": {
            "url": this.URL + "GET",
            "data": {
                /*"file":null,*/
                "qr": "",
                "co": "ImportProducts",
                "purchase_request_id": 0,
                "isq": false
            }
        }
    };

    public cleanItem(prop:string,item:string):void{
        delete this.URL_DATA[prop]["data"][item];
    }

    public PropData(options: { 'action', 'add' }): { 'url', 'data' } {

        if (options.add) {

            for (let index in options.add) {
                this.URL_DATA[options["action"]]['data'][index] = options.add[index];
            }
        }
        let temp: { 'url', 'data' };
        temp = this.URL_DATA[options["action"]];
        return temp;
    }

    public get(prop: string): { 'url', 'data' } {
        return this.URL_DATA[prop];
    }
}
