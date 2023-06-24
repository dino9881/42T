import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

interface PwInputProps {
<<<<<<< HEAD
    channelName: string;
}

function PwInput({ channelName }: PwInputProps) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/chat', { state: { channelName } });
=======
    chIdx: number;
}

function PwInput({ chIdx }: PwInputProps) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/chat', { state: { chIdx } });
>>>>>>> frontend
  };

  return (
    <div className="pw-inputbox">
      <input type="text" name="pw-input" className="pw-input" />
      <Button onClick={handleButtonClick} variant="light" className="pw-input-button" size="sm">
        Enter
      </Button>
    </div>
  );
}

export default PwInput;
