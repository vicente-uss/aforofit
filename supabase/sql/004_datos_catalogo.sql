-- 004_datos_catalogo.sql
-- AforoFit · Avance 2 · Inventario real del gimnasio USS Bellavista (relevado el 17 de noviembre).
-- 11 tipos de máquinas, 12 equipos en total, todos operativos.
-- foto_url guarda la ruta dentro del bucket "maquinas" (ver 003). Se puede ejecutar más de una vez.

insert into public.maquinas (nombre, ejercicio, grupo_muscular, patron_movimiento, cantidad, estado, foto_url)
select v.nombre, v.ejercicio, v.grupo_muscular, v.patron_movimiento, v.cantidad, 'disponible', v.foto_url
from (values
  ('Máquina de press de pecho sentado (SportsArt)', 'Press de pecho', 'Pectorales, deltoides, tríceps', 'empuje horizontal', 1, 'press-pecho-sentado.jpg'),
  ('Máquina de poleas cruzadas (DAP)', 'Cruce de poleas, remo, tríceps y otros', 'Cuerpo completo', 'varios', 1, 'poleas-cruzadas.jpg'),
  ('Máquina Smith', 'Sentadilla, press de pecho, press militar', 'Cuádriceps, glúteos, pectorales', 'sentadilla y empuje', 1, 'maquina-smith.jpg'),
  ('Jaula de sentadillas (rack negro)', 'Sentadilla, peso muerto', 'Cuádriceps, glúteos, isquiosurales', 'sentadilla y bisagra de cadera', 1, 'rack-negro.jpg'),
  ('Jaula de sentadillas (rack blanco)', 'Sentadilla, peso muerto', 'Cuádriceps, glúteos, isquiosurales', 'sentadilla y bisagra de cadera', 1, 'rack-blanco.jpg'),
  ('Prensa de piernas horizontal (SportsArt)', 'Prensa de piernas', 'Cuádriceps, isquiotibiales', 'empuje de piernas', 1, 'prensa-piernas.jpg'),
  ('Banco plano olímpico', 'Press de pecho plano', 'Pectorales, tríceps', 'empuje horizontal', 1, 'banco-plano.jpg'),
  ('Máquina de extensión de piernas', 'Extensión de piernas', 'Cuádriceps', 'aislamiento', 1, 'extension-piernas.jpg'),
  ('Banco declinado olímpico', 'Press de pecho declinado', 'Pectorales (porción inferior), tríceps', 'empuje horizontal', 1, 'banco-declinado.jpg'),
  ('Bicicleta estática (LifeFitness)', 'Trabajo cardiovascular', 'Piernas, sistema cardiovascular', 'cardio', 1, 'bicicleta-estatica.jpg'),
  ('Trotadora (SportsArt)', 'Trabajo cardiovascular', 'Piernas, sistema cardiovascular', 'cardio', 2, 'trotadora.jpg')
) as v(nombre, ejercicio, grupo_muscular, patron_movimiento, cantidad, foto_url)
where not exists (select 1 from public.maquinas m where m.nombre = v.nombre);

-- Implementos de préstamo: cantidades provisorias, confirmar con el profesor encargado.
insert into public.implementos (nombre, categoria, cantidad_total) values
  ('Balón de básquetbol', 'Balones', 4),
  ('Balón de fútbol', 'Balones', 4),
  ('Balón de vóleibol', 'Balones', 2),
  ('Colchoneta', 'Accesorios', 6)
on conflict (nombre) do nothing;

-- Verificación: debería mostrar 11 máquinas con 12 equipos y 4 implementos.
select
  (select count(*) from public.maquinas) as tipos_de_maquinas,
  (select sum(cantidad) from public.maquinas) as total_equipos,
  (select count(*) from public.implementos) as implementos;
