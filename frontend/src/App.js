import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, CircularProgress, Snackbar } from '@mui/material';

function App() {
  const [message, setMessage] = useState('');
  const [originalMessage, setOriginalMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(response).then(() => {
      setCopySuccess(true);
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setOriginalMessage(message);
    try {
      const { data } = await axios.post('http://yourdrink.is/mix/', { message }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setResponse(data.response);
      setOriginalMessage(data.original_message);
    } catch (error) {
      console.error('Error submitting the form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
    <Typography variant="h4" gutterBottom>
      🍹 yourdrink.is 🍸
    </Typography>
    <Typography variant="body1" gutterBottom>
      Imagine a name for a cocktail, our AI mixologist will give you the recipe.
    </Typography>
    <Typography variant="h5" mt={3} gutterBottom> Yes, it works for existing drinks too</Typography>
    <Typography variant="body1" mb={3} gutterBottom> But why order a basic Moscow Mule when you can have a Havana Hava Nana? Swap your Arnold Palmer for a Bob Ross. Put down your Manhattans, try a Jersey Turnpike instead. 
    </Typography>
      <form onSubmit={handleSubmit} m={3}>
        <TextField
          id="message"
          label="Name your dream cocktail"
          multiline
          rows={5}
          fullWidth
          variant="outlined"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Get recipe
          </Button>
          {loading && <CircularProgress size={24} sx={{ marginLeft: 2 }} />}
        </Box>
      </form>
      <Box my={3}>
      {response && (
        <>
          <TextField
            id="message"
            label="Your drink is:"
            multiline
            fullWidth
            variant="outlined"
            required
            value={response}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Box mt={1}>
            <Button onClick={handleCopy} disabled={!response} variant="contained">
              <span>copy text 📋</span>
            </Button>
          </Box>
          <Snackbar
            open={copySuccess}
            autoHideDuration={3000}
            onClose={() => setCopySuccess(false)}
            message="Copied to clipboard!"
          />
        </>
      )}
    </Box>
  </Container>
);
}
export default App;