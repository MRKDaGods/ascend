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
    <FormControl component="fieldset">
      <Typography variant="body1" sx={{ mb: 1 }} id="reason-selection-title">
        Tell us the reason for closing your account:
      </Typography>
      <RadioGroup id="reason-selection-group" value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
        {reasons.map((reason, index) => (
          <FormControlLabel key={reason} id={`reason-option-${index}`} value={reason} control={<Radio />} label={reason} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
