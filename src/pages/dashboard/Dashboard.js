import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  CardActions
} from '@mui/material';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { auth, db, logout } from "../../firebase";
import {
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";
function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    function generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        return result;
      }

    // qna section handling
    const [qnaData, setQnaData] = useState([{ q: '', a: '' }]);
    const handleQnaChange = (index, field, value) => {
        const updatedFormData = [...qnaData];
        updatedFormData[index][field] = value;
        setQnaData(updatedFormData);
      };
      const handleAddQnaField = () => {
        setQnaData([...qnaData, { q: '', a: '' }]);
      };
  const handleRemoveQnaField = (index) => {
    // console.log(qnaData)
    const updatedFormData = qnaData.filter((_, i) => i !== index);
    setQnaData(updatedFormData);
  };

    // features section handling
    const [featuresData, setFeaturesData] = useState(['']);
    const handleFeaturesChange = (index, value) => {
        const updatedFormData = [...featuresData];
        updatedFormData[index] = value;
        setFeaturesData(updatedFormData);
      };
      const handleAddFeaturesField = () => {
        setFeaturesData([...featuresData, '']);
      };
  const handleRemoveFeaturesField = (index) => {
    // console.log(featuresData)
    const updatedFormData = featuresData.filter((_, i) => i !== index);
    setFeaturesData(updatedFormData);
  };

    // stack section handling
    const [stackData, setStackData] = useState(['']);
    const handleStackChange = (index, value) => {
        const updatedFormData = [...stackData];
        updatedFormData[index] = value;
        setStackData(updatedFormData);
      };
      const handleAddStackField = () => {
        setStackData([...stackData, '']);
      };
  const handleRemoveStackField = (index) => {
    // console.log(stackData)
    const updatedFormData = stackData.filter((_, i) => i !== index);
    setStackData(updatedFormData);
  };

    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
    }, [user, loading]);

    
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    desc: '',
    faq: [],
    features: [],
    id: generateRandomString(10),
    image: '',
    price: '',
    smalldesc: '',
    stack: [],
    title: '',
    type: '',
    video: '',
  });

  const addToFirebase = async () => {
    try {
        // const q = query(collection(db, "completeprojectsdata"));
        // const docs = await getDocs(q);
        // console.log(docs.docs)
            await addDoc(collection(db, "completeprojectsdata"), {
                id:formData.id,
                desc:formData.desc,
                stack:stackData,
                title:formData.title,
                type:formData.type,
                price:formData.price,
                image:formData.image,
                video:formData.video,
                smalldesc:formData.smalldesc,
                faq:qnaData,
                features:featuresData
            })
        alert("Data added successfully")
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

  
  const handleAddData = () => {
    // Perform any data validation or sanitization
    // Add the new data to the 'data' state
    // setData((prevData) => [...prevData, formData]);
    addToFirebase();
    // Reset the form
    // setFormData({
    //   desc: '',
    //   faq: [],
    //   features: [],
    //   id: '',
    //   image: '',
    //   price: '',
    //   smalldesc: '',
    //   stack: [],
    //   title: '',
    //   type: '',
    //   video: '',
    // });
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

    return (
        <div className="dashboard">
            <div className="dashboard__container">
            <div>Hello World!</div>
                Logged in as
                <div>{name}</div>
                <div>{user?.email}</div>
                <button className="dashboard__btn" onClick={logout}>
                    Logout
                </button>
            </div>
        <Container maxWidth="md" sx={{ paddingTop: '80px' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Data Interface
          </Typography>
    
          {/* Add Data Form */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Data
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="id"
                    label="ID"
                    value={formData.id}
                    onChange={handleInputChange}
                    // fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="title"
                    label="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="smalldesc"
                    label="small desc"
                    value={formData.smalldesc}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="desc"
                    label="desc"
                    value={formData.desc}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="price"
                    label="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                    // fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="type"
                    label="Type"
                    value={formData.type}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="image"
                    label="Image URL"
                    value={formData.image}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="video"
                    label="video"
                    value={formData.video}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    name="faq"
                    label="FAQs"
                    value={formData.faq}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    name="features"
                    label="Features"
                    value={formData.features}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    name="stack"
                    label="Stack"
                    value={formData.stack}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid> */}
                
      <div style={{display:'flex', flexDirection:"column", justifyContent:'center', alignItems:'center'}}>
      {featuresData.map((field, index) => (
        <div key={index} style={{display:"flex", justifyContent:'center', alignItems:"center"}}>
          <TextField
            label="Add new Feature"
            value={field}
            onChange={(e) => handleFeaturesChange(index, e.target.value)}
          />
          <Button variant="outlined" onClick={() => handleRemoveFeaturesField(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button variant="outlined" onClick={handleAddFeaturesField} sx={{mt:2}}>
        Add 1 More Feature
      </Button></div>

      <div style={{display:'flex', flexDirection:"column", justifyContent:'center', alignItems:'center'}}>
      {stackData.map((field, index) => (
        <div key={index} style={{display:"flex", justifyContent:'center', alignItems:"center"}}>
          <TextField
            label="Add new Stack"
            value={field}
            onChange={(e) => handleStackChange(index, e.target.value)}
          />
          <Button variant="outlined" onClick={() => handleRemoveStackField(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button variant="outlined" onClick={handleAddStackField} sx={{mt:2}}>
        Add 1 More Stack
      </Button></div>

                <div style={{display:'flex', flexDirection:"column", justifyContent:'center', alignItems:'center'}}>
      {qnaData.map((field, index) => (
        <div key={index} style={{display:"flex", justifyContent:'center', alignItems:"center"}}>
          <TextField
            label="Question"
            value={field.q}
            onChange={(e) => handleQnaChange(index, 'q', e.target.value)}
          />
          <TextField
            label="Answer"
            value={field.a}
            onChange={(e) => handleQnaChange(index, 'a', e.target.value)}
          />
          <Button variant="outlined" onClick={() => handleRemoveQnaField(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button variant="outlined" onClick={handleAddQnaField} sx={{mt:2}}>
        Add 1 More Question
      </Button></div>

      {/* <Button variant="contained" type="submit">
        Submit
      </Button> */}
        <CardActions>
          <Button variant="contained" color="primary" onClick={handleAddData}>
            ADD This data to firebase
          </Button>
          {/* <Button variant="outlined" color="secondary">
            Delete
          </Button> */}
        </CardActions>
                {/* Add more input fields for other data properties */}
              </Grid>
            </CardContent>
          </Card>
    
          {/* Display Data */}
          <Grid container spacing={3}>
            {data.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {item.title}
                    </Typography>
                    {/* Display other data properties */}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        </div>
    
    );
}
export default Dashboard;