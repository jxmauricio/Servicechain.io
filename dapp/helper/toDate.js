export default (timeStamp)=>{
    const date= new Date(parseInt(timeStamp)*1000);
    const dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
    console.log(dateFormat)
    return dateFormat
}