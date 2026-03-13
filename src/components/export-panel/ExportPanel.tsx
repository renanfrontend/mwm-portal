import { Drawer, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ExportPanel({ open, onClose }: Props) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 999999 }}
      PaperProps={{ sx: { width: 620, display: "flex", flexDirection: "column", bgcolor: "white" } }}
    >
      <Box sx={{ p: "16px 20px 24px 20px", bgcolor: "white", flexShrink: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 1 }}>
          <IconButton onClick={onClose} sx={{ p: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 700, lineHeight: 1.1 }}>Exportação relatório</Typography>
        </Box>
      </Box>
      <Box sx={{ px: "20px", pt: 2, flex: 1, overflowY: "auto" }}>
        <Typography sx={{ fontSize: 16, mb: 2 }}>
          Escolha o formato do arquivo e o período de datas para gerar o relatório.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Formato do arquivo</Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 3 }}>
            <label>
              <input type="radio" name="format" defaultChecked /> CSV
            </label>
            <label>
              <input type="radio" name="format" /> PDF
            </label>
          </Box>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Período do relatório</Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <input type="date" placeholder="Data Inicial" style={{ fontSize: 16, height: 30, width: 180 }} />
            <input type="date" placeholder="Data Final" style={{ fontSize: 16, height: 30, width: 180 }} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: "auto", p: "24px 20px", bgcolor: "white", display: "flex", gap: 2, flexShrink: 0 }}>
        <Button variant="outlined" onClick={onClose} fullWidth sx={{ height: 48, fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button variant="contained" fullWidth sx={{ height: 48, fontWeight: 600, bgcolor: "#0072C3" }}>
          Exportar
        </Button>
      </Box>
    </Drawer>
  );
}
