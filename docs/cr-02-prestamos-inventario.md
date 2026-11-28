# CR-02 fase 3 · Préstamos e inventario deportivo

La fase parte del PR #32 fusionado en `0069a0b`. La migración [029](../supabase/sql/029_prestamos_inventario.sql) se aplica después de 028. La validación usa un Supabase local desechable y datos ficticios.

## Operación del profesor

1. En **Préstamos**, escribe el nombre o elige un solicitante reciente. Selecciona la ficha existente para conservar el historial. Para un homónimo externo, usa **Registrar otro solicitante con este nombre** y agrega una referencia, por ejemplo el equipo. Cada ficha externa recibe un número propio. En fichas inscritas se usa el RUT o el identificador de la ficha para distinguirlas.
2. Indica las cantidades y confirma la recepción física de la TNE. Al guardar el primer préstamo externo se guarda también su ficha. La identificación y el préstamo se resuelven en la misma transacción.
3. Registra las cantidades devueltas o recibe todo el material pendiente. Después de recuperar el material, usa **Entregar TNE** al devolver físicamente la tarjeta. Si el alumno tiene cuenta vinculada, puedes enviar el aviso de TNE sin retirar.

PostgreSQL serializa los préstamos de la misma persona y bloquea las filas de inventario en orden de ID. Una persona con implementos o TNE pendientes conserva el bloqueo aunque vuelva a buscarse por nombre. Tanto los préstamos nuevos como los históricos se mantienen independientes de visitas y aforo.

En **Historial**, la fecha seleccionada muestra préstamos de alumnos inscritos y solicitantes externos. Los externos se distinguen por su número de ficha y la referencia cuando está registrada. El historial distingue implementos pendientes, TNE pendiente y préstamo cerrado.

## Inventario deportivo

En **Administración → Implementos**, el administrador o profesor con modo administrador activo puede crear y editar fichas con categoría, total, foto opcional y habilitación para préstamo. El stock muestra total, unidades disponibles y prestadas. Desactivar el préstamo conserva la ficha y permite devolver unidades ya prestadas. PostgreSQL rechaza reducir el total bajo las unidades prestadas. Las fichas con historial se conservan.

Las fotos usan el bucket `implementos`, con JPG, PNG o WebP de hasta 2 MB. Las fichas sin foto se muestran como **Sin foto**. La migración conserva el inventario existente y sus cantidades. Queda pendiente que el encargado confirme los bienes, fotos y cantidades del inventario ampliado.

## Validación

- La línea base informada es de 297 Vitest y 597 SQL. El flujo por nombre reutiliza los contratos existentes para stock, historial, devoluciones y avisos. La prueba que afirmaba la devolución conjunta de material y TNE se sustituyó por una comprobación de las dos operaciones explícitas. La firma antigua que devuelve todo el material ahora conserva la TNE hasta ejecutar su entrega.
- La certificación compara préstamos, detalles y catálogo antes y después de 029. Agrega pruebas SQL de permisos, homónimos, identidad vinculada, stock, devoluciones y aforo, además de dos carreras entre transacciones reales.
- La ejecución de Chromium cubre préstamos e inventario a 360 y 1280 px, incluida la selección de la persona, los pendientes, el modo administrador y la carga de una imagen ficticia. El flujo de GitHub Actions adjunta las capturas.
