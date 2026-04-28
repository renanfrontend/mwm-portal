import React from "react";
import { Drawer, Box, Typography, IconButton, Button, Select, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from "@mui/icons-material/Close";
import { exportRelatorio } from '../../services/exportService';
import type { ExportFormat } from '../../services/exportService';
import { downloadBlob } from '../../utils/downloadUtils';
import { CalendarTable } from '../logistica/CalendarTable';
import { addDays } from 'date-fns';


type Planejado = Record<string, unknown>;
type Props = {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly transportadoras: readonly string[];
  readonly dadosPlanejados: readonly Planejado[];
};

export default function ExportPanel({ open, onClose, transportadoras = [], dadosPlanejados = [] }: Props) {
  const [dataInicial, setDataInicial] = React.useState<Date | null>(null);
  const [dataFinal, setDataFinal] = React.useState<Date | null>(null);
  const [selectedTransportadora, setSelectedTransportadora] = React.useState('');
  const [selectedFormat, setSelectedFormat] = React.useState<ExportFormat>('csv');
  const [showCalendarInicial, setShowCalendarInicial] = React.useState(false);
  const [showCalendarFinal, setShowCalendarFinal] = React.useState(false);
  const [currentMonthInicial, setCurrentMonthInicial] = React.useState(new Date());
  const [currentMonthFinal, setCurrentMonthFinal] = React.useState(new Date());
  const [tempWeekInicial, setTempWeekInicial] = React.useState<Date | null>(null);
  const [tempWeekFinal, setTempWeekFinal] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (open) {
      setSelectedTransportadora('');
      setSelectedFormat('csv');
      console.log('ExportPanel aberto. Transportadoras recebidas:', transportadoras);
    }
  }, [open, transportadoras]);

  const handleConfirmInicial = (weekStart: Date) => {
    setDataInicial(weekStart);
    setDataFinal(addDays(weekStart, 6)); // Sábado da mesma semana
    setTempWeekInicial(null);
    setShowCalendarInicial(false);
  };

  const handleConfirmFinal = (weekStart: Date) => {
    setDataFinal(addDays(weekStart, 6)); // Sábado da mesma semana
    setTempWeekFinal(null);
    setShowCalendarFinal(false);
  };

  const handleCancelInicial = () => {
    setShowCalendarInicial(false);
    setTempWeekInicial(null);
  };

  const handleCancelFinal = () => {
    setShowCalendarFinal(false);
    setTempWeekFinal(null);
  };

  const handleExport = async () => {
    if (!dataInicial || !dataFinal) {
      alert('Preencha as datas!');
      return;
    }
    const req = {
      dataInicial: dataInicial.toISOString().slice(0, 10),
      dataFinal: dataFinal.toISOString().slice(0, 10),
      transportadora: selectedTransportadora,
      formato: selectedFormat,
      dadosPlanejados,
    };
    try {
      const blob = await exportRelatorio(req);
      const filename = `relatorio_${req.dataInicial}_${req.dataFinal}.${selectedFormat}`;
      downloadBlob(blob, filename);
    } catch {
      alert('Erro ao exportar relatório');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { marginTop: '64px', height: 'calc(100% - 64px)' }
        }
      }}
    >
      <Box sx={{ p: "16px 20px 24px 20px", bgcolor: "white", flexShrink: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 1 }}>
          <IconButton onClick={onClose} sx={{ p: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <Typography
            sx={{
              color: '#000',
              fontFeatureSettings: "'liga' off, 'clig' off",
              fontFamily: 'Schibsted Grotesk',
              fontSize: 'var(--typography-h4, 32px)',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '123.5%',
              letterSpacing: '0.25px',
              mt: 2
            }}
          >
            Exportação relatório
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: "20px", pt: 2, flex: 1, overflowY: "auto", minHeight: 0 }}>
        <Typography
          sx={{
            color: '#000',
            textAlign: 'justify',
            fontFeatureSettings: "'liga' off, 'clig' off",
            fontFamily: 'Schibsted Grotesk',
            fontSize: 'var(--typography-h6, 20px)',
            fontStyle: 'normal',
            fontWeight: 'var(--fontWeightSemiBoldd, 500)',
            lineHeight: '160%',
            letterSpacing: '0.15px',
            mb: 2
          }}
        >
          Escolha o formato do arquivo e o período de datas para gerar o relatório.
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography
            sx={{
              fontFamily: 'Schibsted Grotesk',
              fontWeight: 700,
              fontStyle: 'bold',
              fontSize: '24px',
              lineHeight: '160%',
              letterSpacing: '0.15px',
              textAlign: 'justify',
              mb: 1
            }}
          >
            Formato do arquivo
          </Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 3 }}>
            <label
              style={{
                color: '#000',
                textAlign: 'justify',
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontFamily: 'Schibsted Grotesk',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 'var(--fontWeightSemiBoldd, 500)',
                lineHeight: '160%',
                letterSpacing: '0.15px'
              }}
            >
              <input type="radio" name="format" checked={selectedFormat === 'csv'} onChange={() => setSelectedFormat('csv')} /> CSV
            </label>
            <label
              style={{
                color: '#000',
                textAlign: 'justify',
                fontFeatureSettings: "'liga' off, 'clig' off",
                fontFamily: 'Schibsted Grotesk',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 'var(--fontWeightSemiBoldd, 500)',
                lineHeight: '160%',
                letterSpacing: '0.15px'
              }}
            >
              <input type="radio" name="format" checked={selectedFormat === 'pdf'} onChange={() => setSelectedFormat('pdf')} /> PDF
            </label>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography
            sx={{
              fontFamily: 'Schibsted Grotesk',
              fontWeight: 700,
              fontStyle: 'bold',
              fontSize: '24px',
              lineHeight: '160%',
              letterSpacing: '0.15px',
              textAlign: 'justify',
              mb: 1
            }}
          >
            Período do relatório
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: "flex", gap: 2, mt: 1, position: 'relative' }}>
              <Box sx={{ position: 'relative' }}>
                <DatePicker
                  label="Data Inicial"
                  format="dd/MM/yyyy"
                  value={dataInicial}
                  onChange={(v) => {
                    setDataInicial(v && typeof v === 'object' && 'toDate' in v ? v.toDate() : v);
                  }}
                  open={false}
                  onOpen={() => setShowCalendarInicial(true)}
                  onClose={() => {}}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { width: 180, height: 40 },
                      onClick: () => setShowCalendarInicial(true)
                    }
                  }}
                />
                {showCalendarInicial && (
                  <Box sx={{ position: 'absolute', top: '60px', left: 0, zIndex: 1000, bgcolor: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', p: 2 }}>
                    <CalendarTable
                      title="Selecione a semana"
                      currentMonth={currentMonthInicial}
                      onMonthChange={setCurrentMonthInicial}
                      tempWeekStart={tempWeekInicial}
                      onWeekSelect={setTempWeekInicial}
                      onConfirm={handleConfirmInicial}
                      onCancel={handleCancelInicial}
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ position: 'relative' }}>
                <DatePicker
                  label="Data Final"
                  format="dd/MM/yyyy"
                  value={dataFinal}
                  onChange={(v) => {
                    setDataFinal(v && typeof v === 'object' && 'toDate' in v ? v.toDate() : v);
                  }}
                  open={false}
                  onOpen={() => setShowCalendarFinal(true)}
                  onClose={() => {}}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { width: 180, height: 40 },
                      onClick: () => setShowCalendarFinal(true)
                    }
                  }}
                />
                {showCalendarFinal && (
                  <Box sx={{ position: 'absolute', top: '60px', left: 0, zIndex: 1000, bgcolor: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', p: 2 }}>
                    <CalendarTable
                      title="Selecione a semana"
                      currentMonth={currentMonthFinal}
                      onMonthChange={setCurrentMonthFinal}
                      tempWeekStart={tempWeekFinal}
                      onWeekSelect={setTempWeekFinal}
                      onConfirm={handleConfirmFinal}
                      onCancel={handleCancelFinal}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </LocalizationProvider>
        </Box>

        <Box sx={{ mt: 4, mb: 4, pointerEvents: 'auto' }}>
          <Typography
            sx={{
              fontFamily: 'Schibsted Grotesk',
              fontWeight: 700,
              fontStyle: 'bold',
              fontSize: '24px',
              lineHeight: '160%',
              letterSpacing: '0.15px',
              textAlign: 'justify',
              mb: 1
            }}
          >
            Filtro por transportadora
          </Typography>
          <Select
            value={selectedTransportadora}
            onChange={e => setSelectedTransportadora(e.target.value)}
            displayEmpty
            fullWidth
            sx={{
              width: '100%',
              fontFamily: 'Schibsted Grotesk',
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '160%',
              letterSpacing: '0.15px',
              borderRadius: '6px',
              background: 'white',
              mb: 0
            }}
            MenuProps={{ PaperProps: { sx: { fontFamily: 'Schibsted Grotesk', fontSize: '18px', fontWeight: 500 } } }}
          >
            <MenuItem value="">Selecione a transportadora</MenuItem>
            {transportadoras.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 70,
          bgcolor: "white",
          display: "flex",
          flexShrink: 0,
          paddingRight: 2,
          paddingLeft: 2,
          px: '20px',
          gap: '20px',
          alignItems: 'center',
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
        }}
      >
        <Button variant="outlined" onClick={onClose} fullWidth sx={{ height: 48, fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button variant="contained" fullWidth sx={{ height: 48, fontWeight: 600, bgcolor: "#0072C3" }} onClick={handleExport}>
          Exportar
        </Button>
      </Box>
    </Drawer>
  );
}
