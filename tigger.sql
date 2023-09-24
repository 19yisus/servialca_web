CREATE OR REPLACE FUNCTION tr_usuario_InsertUpdateDelete() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN -- INSERT: Acción de inserción 
    INSERT INTO tiggerusuario (usuario_id, usuario_usuario, usuario_nombre, usuario_apellido, usuario_cedula, usuario_telefono, usuario_direccion, usuario_correo, usuario_clave, roles_id, sucursal_id, tigger_motivo)
    VALUES (NEW.usuario_id, NEW.usuario_usuario, NEW.usuario_nombre, NEW.usuario_apellido, NEW.usuario_cedula, NEW.usuario_telefono, NEW.usuario_direccion, NEW.usuario_correo, NEW.usuario_clave, NEW.roles_id, NEW.sucursal_id, 'INSERT');

    -- Alerta de inserción 
    RAISE NOTICE 'Se ha insertado un nuevo usuario con ID %', NEW.usuario_id;

  ELSIF TG_OP = 'UPDATE' THEN -- UPDATE: Acción de actualización 
    INSERT INTO tiggerusuario (usuario_id, usuario_usuario, usuario_nombre, usuario_apellido, usuario_cedula, usuario_telefono, usuario_direccion, usuario_correo, usuario_clave, roles_id, sucursal_id, tigger_motivo)
    VALUES (OLD.usuario_id, OLD.usuario_usuario, OLD.usuario_nombre, OLD.usuario_apellido, OLD.usuario_cedula, OLD.usuario_telefono, OLD.usuario_direccion, OLD.usuario_correo, OLD.usuario_clave, OLD.roles_id, OLD.sucursal_id, 'UPDATE');

    -- Alerta de actualización 
    RAISE NOTICE 'Se ha actualizado un usuario con ID %', OLD.usuario_id;

  ELSIF TG_OP = 'DELETE' THEN -- DELETE: Acción de eliminación 
    INSERT INTO tiggerusuario (usuario_id, usuario_usuario, usuario_nombre, usuario_apellido, usuario_cedula, usuario_telefono, usuario_direccion, usuario_correo, usuario_clave, roles_id, sucursal_id, tigger_motivo)
    VALUES (OLD.usuario_id, OLD.usuario_usuario, OLD.usuario_nombre, OLD.usuario_apellido, OLD.usuario_cedula, OLD.usuario_telefono, OLD.usuario_direccion, OLD.usuario_correo, OLD.usuario_clave, OLD.roles_id, OLD.sucursal_id, 'DELETE');

    -- Alerta de eliminación 
    RAISE NOTICE 'Se ha eliminado un usuario con ID %', OLD.usuario_id;

  END IF;

  RETURN NEW;

END;
$$ LANGUAGE plpgsql;

-- Crear el trigger para INSERT, UPDATE y DELETE 
CREATE TRIGGER tr_usuario_InsertUpdateDelete
AFTER INSERT OR UPDATE OR DELETE ON usuario FOR EACH ROW EXECUTE FUNCTION tr_usuario_InsertUpdateDelete();



--- Uso de vehiculo


CREATE OR REPLACE FUNCTION tr_licencia_InsertUpdateDelete() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN -- INSERT: Acción de inserción 
    INSERT INTO tiggerlicencia (licencia_id, cliente_id, licencia_correo, licencia_sangre,, licencia_licencia, licencia_licenciarestante, licencia_montotolar,licencia_abonado, licencia_restante, tigger_motivo)
    VALUES (NEW.licencia_id, NEW.cliente_id, NEW.licencia_correo, NEW.licencia_sangre, NEW.licencia_licencia, NEW.licencia_licenciarestante, NEW.licencia_montotolar, NEW.licnecia_abonado, NEW.licencia_restante, 'INSERT');

    -- Alerta de inserción 
    RAISE NOTICE 'Se ha insertado un nuevo vehiculo con ID %', NEW.licencia_id;

  ELSIF TG_OP = 'UPDATE' THEN -- UPDATE: Acción de actualización 
    INSERT INTO tiggerlicencia (licencia_id, cliente_id, licencia_correo, licencia_sangre, licencia_licencia, licencia_licenciarestante, licencia_montotolar,licencia_abonado, licencia_restante, tigger_motivo)
    VALUES (OLD.licencia_id, OLD.cliente_id, OLD.licencia_correo, OLD.licencia_sangre, OLD.licencia_licencia, OLD.licencia_licenciarestante, OLD.licencia_montotolar, OLD.licnecia_abonado, OLD.licencia_restante, 'UPDATE');

    -- Alerta de actualización 
    RAISE NOTICE 'Se ha actualizado un vehiculo con ID %', OLD.licencia_id;

  ELSIF TG_OP = 'DELETE' THEN -- DELETE: Acción de eliminación 
    INSERT INTO tiggerlicencia (licencia_id, cliente_id, licencia_correo, licencia_sangre, licencia_licencia, licencia_licenciarestante, licencia_montotolar,licencia_abonado, licencia_restante, tigger_motivo)
    VALUES (OLD.licencia_id, OLD.cliente_id, OLD.licencia_correo, OLD.licencia_sangre, OLD.licencia_licencia, OLD.licencia_licenciarestante, OLD.licencia_montotolar, OLD.licnecia_abonado, OLD.licencia_restante, 'DELETE');

    -- Alerta de eliminación 
    RAISE NOTICE 'Se ha eliminado un vehiculo con ID %', OLD.licencia_id;

  END IF;

  RETURN NEW;

END;
$$ LANGUAGE plpgsql;

-- Crear el trigger para INSERT, UPDATE y DELETE 
CREATE TRIGGER tr_licencia_InsertUpdateDelete
AFTER INSERT OR UPDATE OR DELETE ON licencia FOR EACH ROW EXECUTE FUNCTION tr_licencia_InsertUpdateDelete();
