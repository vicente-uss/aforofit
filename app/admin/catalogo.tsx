"use client";

import { Dumbbell, Package, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Tarjeta } from "@/components/marca/tarjeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cantidadInventario, extensionFoto, mensajeCatalogo, TIPOS_FOTO } from "@/lib/admin/catalogo";
import { COLOR_ESTADO, ETIQUETA_ESTADO, esEstadoMaquina, type EstadoMaquina } from "@/lib/profesor/maquinas";
import { urlFotoMaquina } from "@/lib/rutina/pantalla";
import { createClient } from "@/lib/supabase/client";

type Maquina = {
  id: number;
  nombre: string;
  patron_movimiento: string | null;
  ajustes: string | null;
  estado: EstadoMaquina;
  foto_url: string | null;
};

type Implemento = {
  id: number;
  nombre: string;
  categoria: string | null;
  cantidad_total: number;
  disponible: number;
  prestada: number;
  prestable: boolean;
  foto_url: string | null;
};

type Ficha = Maquina | Implemento;
const FOTO_INVALIDA = "Elige una foto JPG, PNG o WebP válida de hasta 2 MB.";
const CAMPO = "w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function esMaquina(ficha: Ficha): ficha is Maquina {
  return "estado" in ficha;
}

function Foto({ nombre, url, Icono }: { nombre: string; url: string | null; Icono: typeof Dumbbell }) {
  const [fallo, setFallo] = useState(false);
  if (!url || fallo) {
    return <div className="m-auto text-center text-slate-500">
      <Icono aria-hidden className="mx-auto size-6" />
      <span className="text-xs">Sin foto</span>
    </div>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={nombre} loading="lazy" className="size-full object-cover" onError={() => setFallo(true)} />
  );
}

export function Catalogo({ tipo }: { tipo: "maquinas" | "implementos" }) {
  const [supabase] = useState(createClient);
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [falloCarga, setFalloCarga] = useState(false);
  const [editor, setEditor] = useState<{ ficha: Ficha | null } | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const enOperacion = useRef(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const [porEliminar, setPorEliminar] = useState<Ficha | null>(null);
  const maquinas = tipo === "maquinas";
  const singular = maquinas ? "máquina" : "implemento";
  const titulo = maquinas ? "Máquinas" : "Inventario deportivo";
  const Icono = maquinas ? Dumbbell : Package;

  const cargar = useCallback(async () => {
    setCargando(true);
    const consulta = maquinas
      ? supabase.from("maquinas").select("id,nombre,patron_movimiento,ajustes,estado,foto_url")
      : supabase.from("catalogo_implementos").select("id,nombre,categoria,cantidad_total,disponible,prestada,prestable,foto_url");
    const { data, error } = await consulta.order("nombre");
    setFalloCarga(Boolean(error));
    if (data) setFichas(data as Ficha[]);
    setCargando(false);
  }, [maquinas, supabase]);

  useEffect(() => { void cargar(); }, [cargar]);

  function abrirEditor(ficha: Ficha | null) {
    setError("");
    setMensaje("");
    setEditor({ ficha });
  }

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!editor || enOperacion.current) return;
    const datos = new FormData(evento.currentTarget);
    const texto = (campo: string) => String(datos.get(campo) ?? "").trim();
    const nombre = texto("nombre");
    const original = editor.ficha;
    setError("");
    setMensaje("");
    if (!nombre) {
      setError("Ingresa un nombre.");
      return;
    }

    enOperacion.current = true;
    setGuardando(true);
    try {
      let valores: Record<string, string | number | boolean | null>;
      let fotoSubida: string | null = null;
      if (maquinas) {
        const estado = datos.get("estado");
        const patron = texto("patron_movimiento");
        const ajustes = texto("ajustes");
        if (!esEstadoMaquina(estado) || (!original && (!patron || !ajustes))) {
          setError("Completa el patrón de movimiento, los ajustes y el estado.");
          return;
        }
        valores = { nombre, patron_movimiento: patron || null, ajustes: ajustes || null, estado };
      } else {
        const cantidad = cantidadInventario(texto("cantidad_total"));
        if (cantidad === null) {
          setError("Ingresa una cantidad entera entre 0 y 2.147.483.647.");
          return;
        }
        valores = { nombre, categoria: texto("categoria") || null, cantidad_total: cantidad, prestable: datos.has("prestable") };
      }

      const foto = datos.get("foto");
      if (foto instanceof File && foto.name) {
        const extension = await extensionFoto(foto);
        if (!extension) {
          setError(FOTO_INVALIDA);
          return;
        }
        try {
          const imagen = await createImageBitmap(foto);
          imagen.close();
        } catch {
          setError(FOTO_INVALIDA);
          return;
        }
        const ruta = `catalogo/${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage.from(tipo).upload(ruta, foto, { contentType: foto.type });
        if (error) {
          setError("No pudimos subir la foto. Revisa la conexión e inténtalo de nuevo.");
          return;
        }
        valores.foto_url = ruta;
        fotoSubida = ruta;
      } else if (maquinas && !original) {
        setError(FOTO_INVALIDA);
        return;
      }

      const tabla = supabase.from(tipo);
      const operacion = original ? tabla.update(valores).eq("id", original.id) : tabla.insert(valores);
      if (original) {
        // Evita sobrescribir una edición simultánea, incluida la mantención del profesor.
        for (const [columna, valor] of Object.entries(original)) {
          if (columna === "id" || columna === "disponible" || columna === "prestada") continue;
          if (valor === null) operacion.is(columna, null);
          else operacion.eq(columna, valor);
        }
      }
      const { data, error } = await operacion.select("id").maybeSingle();
      if (error || !data) {
        // Un rechazo confirmado permite limpiar la subida. Ante un error de
        // transporte, la ficha pudo haberse guardado aunque no llegó la respuesta.
        if (fotoSubida && (!error || /^[0-9A-Z]{5}$/.test(error.code))) {
          await supabase.storage.from(tipo).remove([fotoSubida]);
        }
        setError(error ? mensajeCatalogo(error, maquinas) : "La ficha cambió o ya no está disponible. Cancela la edición y actualiza el catálogo.");
        return;
      }
      setEditor(null);
      setMensaje("Ficha guardada.");
      if (!maquinas && fotoSubida && original?.foto_url) {
        await supabase.storage.from(tipo).remove([original.foto_url]);
      }
      await cargar();
    } catch {
      setError("No pudimos completar la operación. Actualiza el catálogo antes de volver a intentar.");
    } finally {
      enOperacion.current = false;
      setGuardando(false);
    }
  }

  async function eliminar() {
    if (!porEliminar || enOperacion.current) return;
    enOperacion.current = true;
    setGuardando(true);
    dialogo.current?.close();
    try {
      const { data, error } = await supabase.from(tipo)
        .delete().eq("id", porEliminar.id).select("id").maybeSingle();
      if (error || !data) {
        setError(error ? mensajeCatalogo(error, maquinas) : "La ficha ya no está disponible. Actualiza el catálogo.");
        return;
      }
      setEditor(null);
      setMensaje("Ficha eliminada.");
      if (!maquinas && porEliminar.foto_url) await supabase.storage.from(tipo).remove([porEliminar.foto_url]);
      await cargar();
    } catch {
      setError("No pudimos confirmar la eliminación. Actualiza el catálogo antes de volver a intentar.");
    } finally {
      enOperacion.current = false;
      setGuardando(false);
    }
  }

  const ficha = editor?.ficha;
  const fichaMaquina = ficha && esMaquina(ficha) ? ficha : null;
  const fichaImplemento = ficha && !esMaquina(ficha) ? ficha : null;
  const consulta = busqueda.trim().toLocaleLowerCase("es-CL");
  const visibles = fichas.filter(item =>
    (esMaquina(item) ? item.nombre : `${item.nombre} ${item.categoria ?? ""}`).toLocaleLowerCase("es-CL").includes(consulta));

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-navy-900">
            <Icono aria-hidden className="size-6 text-blue-700" />{titulo}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {maquinas ? "Fichas de equipos, fotografías y mantención." : "Implementos deportivos y stock de préstamo."}
          </p>
        </div>
        <Button type="button" disabled={guardando || editor !== null} onClick={() => abrirEditor(null)}>
          <Plus aria-hidden />{maquinas ? "Nueva máquina" : "Nuevo implemento"}
        </Button>
      </header>

      {mensaje && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{mensaje}</p>}
      {error && !editor && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {editor && (
        <Tarjeta className="p-4 sm:p-6">
          <form key={ficha?.id ?? "nueva"} onSubmit={guardar} className="space-y-4">
            <h2 className="text-lg font-semibold text-navy-900">{ficha ? `Editar ${singular}` : `Registrar ${singular}`}</h2>
            <fieldset disabled={guardando} className="grid min-w-0 gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">Nombre
                <Input name="nombre" required maxLength={120} defaultValue={ficha?.nombre} />
              </label>
              {maquinas ? (
                <>
                  <label className="grid gap-1 text-sm font-medium">Patrón de movimiento
                    <Input name="patron_movimiento" required={!ficha} maxLength={120} defaultValue={fichaMaquina?.patron_movimiento ?? ""} />
                  </label>
                  <label className="grid gap-1 text-sm font-medium sm:col-span-2">Ajustes
                    <textarea name="ajustes" rows={3} required={!ficha} maxLength={1000} className={CAMPO} defaultValue={fichaMaquina?.ajustes ?? ""} />
                  </label>
                  <div className="grid gap-1 text-sm font-medium">
                    <label htmlFor="estado-maquina">Estado</label>
                    <select id="estado-maquina" name="estado" className={CAMPO} defaultValue={fichaMaquina?.estado ?? "disponible"}>
                      <option value="disponible">Disponible</option>
                      <option value="en_mantencion">En mantención</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <label className="grid gap-1 text-sm font-medium">Categoría (opcional)
                    <Input name="categoria" maxLength={120} defaultValue={fichaImplemento?.categoria ?? ""} />
                  </label>
                  <label className="grid gap-1 text-sm font-medium">Cantidad total
                    <Input name="cantidad_total" inputMode="numeric" pattern="[0-9]+" required defaultValue={fichaImplemento?.cantidad_total ?? 0} />
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input name="prestable" type="checkbox" className="size-4 accent-blue-700" defaultChecked={fichaImplemento?.prestable ?? true} />
                    Habilitado para préstamo
                  </label>
                </>
              )}
              <div className="min-w-0">
                <label className="grid gap-1 text-sm font-medium">
                  {ficha?.foto_url ? "Reemplazar fotografía (opcional)" : maquinas ? "Fotografía" : "Fotografía (opcional)"}
                  <Input type="file" name="foto" accept={TIPOS_FOTO} required={maquinas && !ficha} aria-describedby="formatos-foto" />
                </label>
                <p id="formatos-foto" className="mt-1 text-xs text-slate-600">JPG, PNG o WebP, hasta 2 MB.</p>
              </div>
            </fieldset>
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <Button disabled={guardando}>{guardando ? "Guardando…" : "Guardar"}</Button>
              <Button type="button" variant="outline" disabled={guardando} onClick={() => { setEditor(null); setError(""); }}>Cancelar</Button>
            </div>
          </form>
        </Tarjeta>
      )}

      <div className="flex flex-wrap items-end gap-2">
        <label className="grid w-full max-w-sm gap-1 text-sm font-medium">{maquinas ? "Buscar por nombre" : "Buscar por nombre o categoría"}
          <span className="relative">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-500" />
            <Input type="search" className="pl-9" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </span>
        </label>
        <Button type="button" variant="outline" disabled={cargando || guardando} onClick={() => void cargar()}>Actualizar</Button>
      </div>
      {cargando && <p role="status" className="text-sm text-slate-600">Cargando catálogo…</p>}
      {falloCarga && <p role="alert" className="text-sm text-red-800">No pudimos actualizar el catálogo. Inténtalo de nuevo.</p>}
      {!cargando && !falloCarga && visibles.length === 0 && (
        <p className="text-sm text-slate-600">{consulta ? "No hay coincidencias." : "El catálogo está vacío."}</p>
      )}
      <ul className="grid gap-3 xl:grid-cols-2">
        {visibles.map((item) => (
          <li key={item.id} className="min-w-0">
            <Tarjeta className="flex h-full flex-col gap-4 p-4">
              <div className="flex min-w-0 gap-3">
                <div className="flex size-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Foto key={item.foto_url} nombre={item.nombre} Icono={Icono} url={esMaquina(item)
                    ? urlFotoMaquina(process.env.NEXT_PUBLIC_SUPABASE_URL, item.foto_url)
                    : item.foto_url && supabase.storage.from(tipo).getPublicUrl(item.foto_url).data.publicUrl} />
                </div>
                <div className="min-w-0 space-y-1 break-words">
                  <h2 className="font-semibold text-navy-900">{item.nombre}</h2>
                  {esMaquina(item) ? (
                    <>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${COLOR_ESTADO[item.estado]}`}>{ETIQUETA_ESTADO[item.estado]}</span>
                      <p className="text-sm text-slate-600">Patrón · {item.patron_movimiento || "Sin especificar"}</p>
                      <p className="whitespace-pre-line text-sm text-slate-600">Ajustes · {item.ajustes || "Sin especificar"}</p>
                    </>
                  ) : <>
                    {item.categoria && <p className="text-sm text-slate-600">{item.categoria}</p>}
                    {!item.prestable && <p className="text-sm font-medium text-slate-600">No prestable</p>}
                  </>}
                </div>
              </div>
              {!esMaquina(item) && (
                <dl className="grid grid-cols-3 gap-2 text-sm">
                  {([["Total", item.cantidad_total], ["Disponible", item.disponible], ["Prestada", item.prestada]] as const).map(([etiqueta, valor]) => (
                    <div key={etiqueta} className="min-w-0 rounded-lg bg-slate-50 p-2">
                      <dt className="text-xs text-slate-600">{etiqueta}</dt>
                      <dd className="break-all font-semibold tabular-nums text-navy-900">{valor}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="mt-auto flex flex-wrap gap-2">
                <Button type="button" variant="outline" disabled={guardando || Boolean(editor)} onClick={() => {
                  abrirEditor(item);
                  window.scrollTo({ top: 0 });
                }}>Editar</Button>
                <Button type="button" variant="ghost" className="text-red-700 hover:text-red-800" disabled={guardando || Boolean(editor)} onClick={() => {
                  setPorEliminar(item);
                  setError("");
                  setMensaje("");
                  dialogo.current?.showModal();
                }}>Eliminar</Button>
              </div>
            </Tarjeta>
          </li>
        ))}
      </ul>

      <dialog ref={dialogo} aria-labelledby="confirmar-eliminacion" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl p-5 shadow-lg backdrop:bg-slate-950/50">
        <h2 id="confirmar-eliminacion" className="break-words text-lg font-semibold text-navy-900">¿Eliminar «{porEliminar?.nombre}»?</h2>
        <p className="mt-2 text-sm text-slate-600">Si la ficha tiene registros asociados, se conservará. La eliminación es definitiva.</p>
        <form method="dialog" className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button type="button" variant="destructive" onClick={() => void eliminar()}>Confirmar eliminación</Button>
        </form>
      </dialog>
    </div>
  );
}
