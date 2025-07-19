import { Button } from '@mui/material';

const EditButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="contained"
    style={{
      backgroundColor: '#1a73e8',
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: '15px',
      borderRadius: '8px',
      marginLeft: '10px'
    }}
  >
    ✏️ Edit
  </Button>
);

export default EditButton;