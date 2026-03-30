"use client";
import { Box, CircularProgress, Typography } from "@mui/material";

interface AnalyticsCardProps {
  title: string;
  value: number;
  color: string;
  percentage?: number;
}

export default function AnalyticsCard({ title, value, color, percentage = 75 }: AnalyticsCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        borderRadius: 4,
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'relative',
        width: 220,
        height: 220,
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={140}
          thickness={5}
          sx={{ color: `${color}20` }}
        />
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={140}
          thickness={5}
          sx={{
            position: 'absolute',
            left: 0,
            color: color,
            animation: 'progress 1s ease-out forwards',
            '@keyframes progress': {
              '0%': { transform: 'rotate(-90deg)' },
              '100%': { transform: 'rotate(0)' }
            }
          }}
        />
        <Typography
          variant="h4"
          sx={{
            position: 'absolute',
            fontWeight: 'bold',
            color: color,
          }}
        >
          {value}
        </Typography>
      </Box>
      <Typography 
        variant="h6" 
        textAlign="center"
        sx={{
          color: '#333',
          fontSize: '1.1rem',
          fontWeight: 'medium'
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
