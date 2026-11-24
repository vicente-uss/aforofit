-- AforoFit · Cantidades reales de implementos para préstamo (Playback con el encargado, 24 de noviembre de 2026).
-- Reemplaza las cantidades provisorias de 004_datos_catalogo.sql. Ver docs/acta-playback-2026-11-24.md.
-- La colchoneta no es un implemento de préstamo: se elimina (todavía no existen préstamos que la referencien).

delete from public.implementos where nombre = 'Colchoneta';

insert into public.implementos (nombre, categoria, cantidad_total) values
  ('Balón de fútbol',         'Balones',    2),
  ('Balón de vóleibol',       'Balones',    2),
  ('Balón de básquetbol',     'Balones',    2),
  ('Paleta',                  'Accesorios', 2),
  ('Pelota de taca-taca',     'Accesorios', 1)
on conflict (nombre) do update set
  categoria      = excluded.categoria,
  cantidad_total = excluded.cantidad_total;

-- Verificación: debería mostrar 5 implementos y 9 unidades en total.
select count(*) as implementos, sum(cantidad_total) as unidades from public.implementos;
