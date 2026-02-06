-- to formate this file run "sql-formatter --language mysql sql/schema.sql"

-- =========================
-- MASTER TABLES
-- =========================
CREATE DATABASE medcot_erp_db;

USE medcot_erp_db;

CREATE TABLE supplier_master (
  supplier_code VARCHAR(8) PRIMARY KEY CHECK (supplier_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  supplier_name VARCHAR(150) NOT NULL,
  poc_name VARCHAR(150) NOT NULL,
  gst_number VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  payment_terms VARCHAR(50),
  lead_time_days INT CHECK (lead_time_days >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  extra_details VARCHAR(100),
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE uom_master (
  uom_code VARCHAR(8) PRIMARY KEY CHECK (uom_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  uom_name VARCHAR(50) NOT NULL,
  description TEXT,
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE raw_material_master (
  rm_code VARCHAR(8) PRIMARY KEY CHECK (rm_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  rm_name VARCHAR(150) NOT NULL,
  uom_code VARCHAR(8) NOT NULL,
  grade VARCHAR(50),
  storage_condition VARCHAR(100),
  qc_required BOOLEAN DEFAULT TRUE,
  cost DECIMAL(12, 2),
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rm_uom FOREIGN KEY (uom_code) REFERENCES uom_master (uom_code)
);

CREATE TABLE medcot_erp_db.product_master (
  product_code VARCHAR(8) PRIMARY KEY CHECK (product_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  product_name VARCHAR(150) NOT NULL,
  category VARCHAR(50),
  uom_code VARCHAR(8) REFERENCES uom_master (uom_code),
  tax_category VARCHAR(50),
  packaging VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50)
);

CREATE TABLE medcot_erp_db.employee_master (
  emp_code VARCHAR(8) PRIMARY KEY CHECK (emp_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  emp_name VARCHAR(100) NOT NULL,
  role VARCHAR(50),
  department VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50)
);

-- =========================
-- PROCUREMENT
-- =========================
CREATE TABLE purchase_order (
  po_code VARCHAR(8) PRIMARY KEY CHECK (po_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  supplier_code VARCHAR(8) NOT NULL,
  po_date DATE NOT NULL,
  lead_time_days INT,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
    status IN (
      'Pending',
      'Approved',
      'Rejected',
      'Cancelled',
      'Closed'
    )
  ),
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_code) REFERENCES supplier_master (supplier_code)
);

CREATE TABLE purchase_order_item (
  po_item_code VARCHAR(30) PRIMARY KEY,
  po_code VARCHAR(8) NOT NULL,
  rm_code VARCHAR(8) NOT NULL,
  quantity DECIMAL(12, 2) NOT NULL CHECK (quantity > 0),
  uom_code VARCHAR(8) NOT NULL,
  rate DECIMAL(12, 2),
  tax_pct DECIMAL(5, 2),
  created_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- GRN & BATCH
-- =========================
CREATE TABLE medcot_erp_db.grn (
  grn_code VARCHAR(8) PRIMARY KEY CHECK (grn_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  po_code VARCHAR(8) REFERENCES purchase_order (po_code),
  supplier_code VARCHAR(8) REFERENCES supplier_master (supplier_code),
  grn_date DATE NOT NULL,
  received_by VARCHAR(8) REFERENCES employee_master (emp_code),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50)
);

CREATE TABLE medcot_erp_db.grn_item (
  grn_item_code VARCHAR(8) PRIMARY KEY CHECK (grn_item_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  grn_code VARCHAR(8) NOT NULL REFERENCES grn (grn_code),
  line_no VARCHAR(10) NOT NULL,
  rm_code VARCHAR(8) NOT NULL REFERENCES raw_material_master (rm_code),
  uom_code VARCHAR(8) NOT NULL REFERENCES uom_master (uom_code),
  ordered_qty NUMERIC(12, 2) NOT NULL CHECK (ordered_qty >= 0),
  received_qty NUMERIC(12, 2) NOT NULL CHECK (received_qty >= 0),
  batch_no VARCHAR(40) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Short', 'Exact', 'Excess')),
  difference NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50),
  UNIQUE (grn_code, line_no)
);

CREATE TABLE medcot_erp_db.material_batch (
  batch_code VARCHAR(8) PRIMARY KEY CHECK (batch_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  grn_item_code VARCHAR(8) NOT NULL REFERENCES grn_item (grn_item_code),
  rm_code VARCHAR(8) NOT NULL REFERENCES raw_material_master (rm_code),
  batch_no VARCHAR(40) NOT NULL,
  received_qty NUMERIC(12, 2) NOT NULL CHECK (received_qty >= 0),
  assigned_qty NUMERIC(12, 2) NOT NULL CHECK (assigned_qty >= 0),
  expiry_date DATE,
  status VARCHAR(20) DEFAULT 'Assigned' CHECK (
    status IN (
      'Assigned',
      'QC_Pending',
      'QC_Approved',
      'Consumed'
    )
  ),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50),
  CHECK (assigned_qty <= received_qty),
  UNIQUE (rm_code, batch_no)
);

-- =========================
-- QC & BOM
-- =========================
CREATE TABLE medcot_erp_db.qc_inspection (
  qc_code VARCHAR(8) PRIMARY KEY CHECK (qc_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  grn_code VARCHAR(8) REFERENCES grn (grn_code),
  qc_date DATE,
  inspector VARCHAR(8) REFERENCES employee_master (emp_code),
  sample_size INT,
  result VARCHAR(20) CHECK (result IN ('Pass', 'Fail', 'Hold')),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50)
);

CREATE TABLE medcot_erp_db.bom_header (
  bom_code VARCHAR(8) PRIMARY KEY CHECK (bom_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  product_code VARCHAR(8) REFERENCES product_master (product_code),
  bom_version VARCHAR(20) DEFAULT 'V1',
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50),
  UNIQUE (product_code, bom_version)
);

CREATE TABLE medcot_erp_db.bom_detail (
  bom_detail_code VARCHAR(8) PRIMARY KEY CHECK (bom_detail_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  bom_code VARCHAR(8) REFERENCES bom_header (bom_code),
  rm_code VARCHAR(8) REFERENCES raw_material_master (rm_code),
  quantity NUMERIC(12, 2),
  process_loss NUMERIC(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50)
);

-- =========================
-- PRODUCTION & INVENTORY
-- =========================
CREATE TABLE medcot_erp_db.work_order (
  wo_code VARCHAR(8) PRIMARY KEY CHECK (wo_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  product_code VARCHAR(8) REFERENCES product_master (product_code),
  quantity NUMERIC(12, 2),
  uom_code VARCHAR(8) REFERENCES uom_master (uom_code),
  planned_start DATE,
  planned_end DATE,
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  production_line VARCHAR(50),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50)
);

CREATE TABLE medcot_erp_db.material_issue (
  issue_code VARCHAR(8) PRIMARY KEY CHECK (issue_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  wo_code VARCHAR(8) REFERENCES work_order (wo_code),
  issue_date DATE,
  issued_by VARCHAR(8) REFERENCES employee_master (emp_code),
  production_line VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50)
);

CREATE TABLE medcot_erp_db.material_return (
  return_code VARCHAR(8) PRIMARY KEY CHECK (return_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  return_source VARCHAR(30) NOT NULL CHECK (
    return_source IN ('Production', 'QualityCheck', 'ExcessIssue')
  ),
  reference_code VARCHAR(8),
  return_date DATE NOT NULL DEFAULT CURRENT_DATE,
  returned_by VARCHAR(8) REFERENCES employee_master (emp_code),
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'Returned' CHECK (status IN ('Draft', 'Returned', 'Cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50)
);

CREATE TABLE medcot_erp_db.inventory_transaction (
  txn_code VARCHAR(8) PRIMARY KEY CHECK (txn_code REGEXP '^[A-Z]{3}[0-9]{5}$'),
  txn_date DATE NOT NULL,
  item_code VARCHAR(8) NOT NULL,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('RawMaterial', 'FinishedGoods')),
  batch_no VARCHAR(40),
  txn_type VARCHAR(20) NOT NULL CHECK (txn_type IN ('In', 'Out', 'Adjustment')),
  quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
  uom_code VARCHAR(8) REFERENCES uom_master (uom_code),
  reference_code VARCHAR(20),
  location VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP,
  updated_by VARCHAR(50)
);