export default (data)=>{
    var total = 0;
    for (var i =0 ;i<data.length;i++){
        total += parseInt(data[i].value)
    }
    return total/parseFloat(data.length);
}