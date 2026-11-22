-- 009_corregir_rol_admin_demo.sql
-- AforoFit · Avance 3 · Corrige un error de datos: admin.demo había quedado con rol 'alumno'.
-- Requiere 001_perfiles_roles.sql. Se puede ejecutar más de una vez.

update public.perfiles p
set rol = 'admin'
from auth.users u
where u.id = p.id
  and u.email = 'admin.demo@aforofit.cl'
  and p.rol <> 'admin';
