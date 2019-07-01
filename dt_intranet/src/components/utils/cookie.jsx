class Cookie{
    static readCookie(key, value=""){
        let st_conn = document.cookie;
        let array=st_conn.split(";");
        for (let element of array) {
            element=element.trim().split("=");
            if( element[0]==key) return element[1];
        }
        
        return "";
    }

}
export default Cookie;