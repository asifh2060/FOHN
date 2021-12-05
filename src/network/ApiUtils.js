const ApiUtils = {
    checkStatus: function (response) {
        console.log("ApiResponse",JSON.stringify(response))
        if (response.ok) {
            return response;
        } else {
            let error;
            if(response.msg!=null)
            {
                error = new Error(response.msg);
                error.response = response;
                throw error;
            }else
            {
                let statusText = 'Internal server error';
                if (response.statusText)
                    statusText = response.statusText;
                error = new Error(statusText);
                console.log("INTERNAL-ERROR", response.statusText);
                console.log(response);
                error.response = response;
            }

            throw error;
        }
    },
    readResponse: async function (response) {
        const resp = await response.json();
        if (resp) {
            console.log("API-RESP", JSON.stringify(resp));
            if (resp.errors && resp.errors[0]) {
                resp.data.warningMessage = resp.errors[0];
            }
            return resp;
        } else {
            console.log("API-ERROR", resp);
            throw new Error(resp.errors[0]);
        }
    }
};
export {ApiUtils as default};
