const axiosRequest=require('axios');

async function getActivity(){
    const activity = await axiosRequest('https://www.boredapi.com/api/activity');
    console.log(activity.data.price);
}

getActivity();
console.log('hello');