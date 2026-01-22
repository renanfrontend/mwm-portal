import React from 'react';
import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import MovingIcon from '@mui/icons-material/Moving';

interface MetricCardProps {
  title: string;
  mainValue: string | number;
  secondaryValue?: string;
  icon: React.ReactNode;
  details: { label: string; value: string | number }[];
}

const MetricCard: React.FC<MetricCardProps> = ({ title, mainValue, secondaryValue, icon, details }) => {
  return (
    <Paper elevation={0} sx={{ 
      p: { xs: '16px', md: '20px', lg: '24px' }, 
      borderRadius: '4px', 
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
      bgcolor: '#FFFFFF',
      width: '100%',
      // CORREÇÃO: Aplicando 214px para md e lg para cobrir a tela de 1366px
      minHeight: { 
        xs: 'auto', 
        md: '214px', 
        lg: '210px', // Garante que em 1366px não pegue os 282px
        xl: '282px'  // Mantém o tamanho grande apenas em monitores muito largos
      }, 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }}>
      <Box>
        {/* Cabeçalho do Card */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 1.5, md: 2 } }}>
          <Box sx={{ color: '#0072C3', display: 'flex', '& svg': { fontSize: { md: 26, lg: 32 } } }}>
            {icon}
          </Box>
          <Typography sx={{ 
            fontSize: { md: '15px', lg: '18px' }, 
            fontWeight: 500, 
            fontFamily: 'Schibsted Grotesk' 
          }}>
            {title}
          </Typography>
        </Box>

        {/* Valores e Indicadores */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography sx={{ 
              fontSize: { xs: '32px', md: '36px', lg: '42px' }, 
              fontWeight: 500, 
              fontFamily: 'Schibsted Grotesk' 
            }}>
              {mainValue}
            </Typography>
            <CheckIcon sx={{ color: '#70BF54', fontSize: { md: 20, lg: 24 } }} />
          </Stack>

          {secondaryValue && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography sx={{ 
                fontSize: { md: '18px', lg: '20px' }, 
                color: 'rgba(0,0,0,0.6)', 
                fontFamily: 'Schibsted Grotesk' 
              }}>
                {secondaryValue}
              </Typography>
              <MovingIcon sx={{ color: '#003052', fontSize: { md: 16, lg: 20 } }} />
            </Stack>
          )}
        </Box>
      </Box>

      {/* Rodapé com detalhes operacionais */}
      <Box>
        <Divider sx={{ mb: { xs: 1, md: 1.5 }, borderColor: '#E8E9EE' }} />
        <Stack spacing={0.5}>
          {details.map((d, i) => (
            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '12px', color: '#333', fontFamily: 'Schibsted Grotesk' }}>
                {d.label}
              </Typography>
              <Typography sx={{ fontSize: '12px', fontWeight: 500, fontFamily: 'Schibsted Grotesk' }}>
                {d.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default MetricCard;