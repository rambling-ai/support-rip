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
      const { data } = await axios.post('http://localhost:8006/fix/', { message }, {
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
      💀 support.rip 🪦
    </Typography>
    <Typography variant="body1" gutterBottom>
      AI is dooming our profession, right? And like, faster than we thought. But Support professionals that leverage AI tooling can be more effective than a human or language model alone.
    </Typography>
    <Typography variant="h5" mt={3} gutterBottom>🖤 support.rip is here to put the tools in the hands of the workers</Typography>
    <Typography variant="body1" mb={3} gutterBottom>
      Our first tool? It's to reduce the cognitive burden of maintaining <b>Support Tone</b>. Write a message as tersely as you like, please DGAF about typos or grammar, don't be chipper or even polite. We <i>got</i> you, boo. Offload your cognitive burden onto our silicon friends like it's 2029.
    </Typography>
      <form onSubmit={handleSubmit} m={3}>
        <TextField
          id="message"
          label="What you feel like typing"
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
            convert to Support Tone
          </Button>
          {loading && <CircularProgress size={24} sx={{ marginLeft: 2 }} />}
        </Box>
      </form>
      <Box my={3}>
      {response && (
        <>
          <TextField
            id="message"
            label="What you meant to say"
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