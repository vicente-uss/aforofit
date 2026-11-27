-- Retirar primero la pantalla en la versión desplegada. Eliminar la tabla borra sus datos.
-- La reversión solo procede tras una decisión explícita sobre las mediciones existentes.
begin;
drop table if exists public.mediciones;
commit;
