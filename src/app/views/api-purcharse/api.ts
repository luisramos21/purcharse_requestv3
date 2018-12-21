export class Api {

    public URL :string = "http://localhost:808/api/purcharse_request/";  
    //public URL: string = "http://localhost/api/purcharse_request/";
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
            "data":{ 'qr': 'orders' }
        },      
        "GET_ORDERS_PEND":
        {
            "url": this.URL + "GET",
            "data":{
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
        }
    };

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
