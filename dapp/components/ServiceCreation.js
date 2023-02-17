import React from 'react'
import { Form,Button,Message,label } from 'semantic-ui-react'
function ServiceCreation(props) {
  const {setOrgName} = props;
  //used to handle errors
  const [error,setError] = useState('');
  //used to prompt up loading circle for the button
  const [loading, setLoading] = useState(false);
 
  const onSubmit = async(event)=>{
    event.preventDefault();
    setLoading(true);
    setError('');
    try{
        //gets the accounts linked to metamask
        const accounts = await web3.eth.getAccounts();
        //creates the service and uses the first account in metamask to create it
        await factory.methods.createService(orgName)
        .send({ from:accounts[0]});
    } catch(err){
        setError(err.message);

    }
    setLoading(false);
  }



  return (
    <div><h3>Create a Service</h3>
        <Form onSubmit={onSubmit} error={error ? true : false}>
            <Form.Field>
                <label>Organization Name</label>
                <Input
                 label = 'wei'
                 labelPosition='right'
                 value ={orgName}
                 onChange={event=>setOrgName(event.target.value)}
                />
            </Form.Field>
            <Message error header = 'Oops!' content = {error}/>
            <Button primary loading={loading}>Create!</Button>
        </Form>
    </div>
  )
}

export default ServiceCreation;