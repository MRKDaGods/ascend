"use client";
import React from "react";
import { FormControl, FormControlLabel, RadioGroup, Radio, Typography } from "@mui/material";

const reasons = [
  "I have a duplicate account",
  "I'm getting too many emails",
  "I'm not getting any value from my membership",
  "I have a privacy concern",
  "I'm receiving unwanted contact",
  "Other",
];

export default function ReasonSelection({ selectedReason, setSelectedReason }: { selectedReason: string; setSelectedReason: (reason: string) => void }) {
  return (
    <FormControl id="reason-selection-container" component="fieldset">
      <Typography id="reason-selection-title" variant="body1" sx={{ mb: 1 }}>
        Tell us the reason for closing your account:
      </Typography>
      <RadioGroup
        id="reason-selection-group"
        value={selectedReason}
        onChange={(e) => setSelectedReason(e.target.value)}
      >
        {reasons.map((reason, index) => (
          <FormControlLabel
            id={`reason-option-${index}`}
            key={reason}
            value={reason}
            control={<Radio id={`reason-radio-${index}`} />}
            label={reason}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
