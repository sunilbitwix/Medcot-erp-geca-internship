import pool from '../config/db.js';

// get stock summary
export const stockSummary = async ({ fromDate, toDate, itemType }) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      item_code,
      batch_no,
      uom_code,
      SUM(CASE WHEN txn_type = 'In' THEN quantity ELSE 0 END) AS inQty,
      SUM(CASE WHEN txn_type = 'Out' THEN quantity ELSE 0 END) AS outQty
    FROM inventory_transaction
    WHERE txn_date BETWEEN ? AND ?
      ${itemType ? 'AND item_type = ?' : ''}
    GROUP BY item_code, batch_no, uom_code
    `,
    itemType ? [fromDate, toDate, itemType] : [fromDate, toDate]
  );

  return rows.map((r) => ({
    itemCode: r.item_code,
    batchId: r.batch_no,
    inQty: Number(r.inQty),
    outQty: Number(r.outQty),
    closingQty: Number(r.inQty) - Number(r.outQty),
    uom: r.uom_code,
  }));
};

// get consuption report
export const consumptionReport = async (woId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      rm.rm_name,
      (bd.quantity * wo.quantity) AS bomQty,
      COALESCE(SUM(it.quantity),0) AS actualConsumed
    FROM work_order wo
    JOIN bom_header bh ON bh.product_code = wo.product_code AND bh.status = 'Active'
    JOIN bom_detail bd ON bd.bom_code = bh.bom_code
    JOIN raw_material_master rm ON rm.rm_code = bd.rm_code
    LEFT JOIN inventory_transaction it
      ON it.reference_code = wo.wo_code
     AND it.item_code = bd.rm_code
     AND it.txn_type = 'Out'
    WHERE wo.wo_code = ?
    GROUP BY rm.rm_name, bd.quantity, wo.quantity
    `,
    [woId]
  );

  return rows.map((r) => {
    const variance = Number(r.actualConsumed) - Number(r.bomQty);
    return {
      rmName: r.rm_name,
      bomQty: Number(r.bomQty),
      actualConsumed: Number(r.actualConsumed),
      variance,
      varianceType: variance > 0 ? 'OVER' : variance < 0 ? 'UNDER' : 'EXACT',
    };
  });
};

// get production efficiency
export const productionEfficiency = async ({ fromDate, toDate }) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      wo_code,
      quantity AS expectedOutput,
      quantity AS actualOutput
    FROM work_order
    WHERE planned_start BETWEEN ? AND ?
    `,
    [fromDate, toDate]
  );

  return rows.map((r) => ({
    workOrderNo: r.wo_code,
    expectedOutput: Number(r.expectedOutput),
    actualOutput: Number(r.actualOutput),
    efficiencyPercentage:
      r.expectedOutput === 0 ? 0 : (r.actualOutput / r.expectedOutput) * 100,
  }));
};

// get qc summary
export const qcSummary = async ({ fromDate, toDate }) => {
  const [[result]] = await pool.execute(
    `
    SELECT 
      COUNT(*) AS totalInspected,
      SUM(result='Pass') AS passed,
      SUM(result='Fail') AS failed
    FROM qc_inspection
    WHERE qc_date BETWEEN ? AND ?
    `,
    [fromDate, toDate]
  );

  return {
    totalInspected: Number(result.totalInspected || 0),
    passed: Number(result.passed || 0),
    failed: Number(result.failed || 0),
    ncrGenerated: 0,
    capaClosed: 0,
  };
};

// get batch traceability
export const batchTraceability = async (batchId) => {
  const [[batch]] = await pool.execute(
    `
    SELECT 
      mb.batch_code,
      mb.batch_no,
      rm.rm_name,
      gi.grn_code
    FROM material_batch mb
    JOIN raw_material_master rm ON rm.rm_code = mb.rm_code
    JOIN grn_item gi ON gi.grn_item_code = mb.grn_item_code
    WHERE mb.batch_code = ?
    `,
    [batchId]
  );

  if (!batch) return null;

  return {
    batchId: batch.batch_code,
    rawMaterials: [batch.rm_name],
    workOrder: null,
    qcStatus: null,
    dispatchedTo: null,
  };
};
