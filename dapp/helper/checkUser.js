const { useAppContext } = require("@/context/AppContext");
//checks the role of the current user 
export default ()=>{
    const {userData} = useAppContext();
    return userData.role;
}