export default (data)=>{
    var total = 0;
    for (var i =0 ;i<data.length;i++){
        total += parseInt(data[i].value)
    }
    return Math.round(total/parseFloat(data.length)*100)/100;
}