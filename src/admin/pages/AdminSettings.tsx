import { useState, useEffect } from 'react';
import { useAdmin } from '../AdminContext';
import { getEndpointValue, setEndpoint, clearEndpoint } from '../../services/googleSheets';

export default function AdminSettings() {
  const { data, updateConfig } = useAdmin();
  const [tools, setTools] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');
  const [newChecklist, setNewChecklist] = useState('');
  const [endpoint, setEndpointUrl] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    setTools(data.config.tools);
    setChecklist(data.config.checklist);
    setEndpointUrl(getEndpointValue());
  }, [data.config]);

  const handleSave = () => {
    updateConfig(tools, checklist);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const addTool = () => {
    if (newTool.trim() && !tools.includes(newTool.trim())) {
      setTools([...tools, newTool.trim()]);
      setNewTool('');
    }
  };

  const removeTool = (t: string) => setTools(tools.filter(x => x !== t));

  const addChecklistItem = () => {
    if (newChecklist.trim() && !checklist.includes(newChecklist.trim())) {
      setChecklist([...checklist, newChecklist.trim()]);
      setNewChecklist('');
    }
  };

  const removeChecklistItem = (item: string) => setChecklist(checklist.filter(x => x !== item));

  const saveEndpoint = () => {
    if (endpoint.trim()) {
      setEndpoint(endpoint);
    } else {
      clearEndpoint();
    }
  };

  const clearSheetConnection = () => {
    clearEndpoint();
    setEndpointUrl('');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h4 className="fw-bold mb-0">Settings</h4>
        <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Manage your site configuration and database connection</p>
      </div>

      <div className="row g-4">
        {/* AON Tools */}
        <div className="col-12 col-lg-6">
          <div className="admin-card">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-tools me-2 text-aon-red"></i>AON Tools
              </h6>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Tools displayed in the AON Tools section</p>

              <div className="d-flex gap-2 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add tool name..."
                  value={newTool}
                  onChange={e => setNewTool(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTool(); } }}
                />
                <button className="btn btn-aon-red" onClick={addTool} type="button">
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {tools.map(t => (
                  <span key={t} className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-3" style={{ fontSize: '0.8rem' }}>
                    {t}
                    <button type="button" className="btn-close btn-close-sm ms-1" onClick={() => removeTool(t)} style={{ fontSize: '0.5rem' }}></button>
                  </span>
                ))}
                {tools.length === 0 && <p className="text-muted" style={{ fontSize: '0.8rem' }}>No tools added</p>}
              </div>
            </div>
          </div>
        </div>

        {/* New Joiner Checklist */}
        <div className="col-12 col-lg-6">
          <div className="admin-card">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-list-check me-2 text-aon-red"></i>New Joiner Checklist
              </h6>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Items shown in the New Joiner Essentials section</p>

              <div className="d-flex gap-2 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add checklist item..."
                  value={newChecklist}
                  onChange={e => setNewChecklist(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChecklistItem(); } }}
                />
                <button className="btn btn-aon-red" onClick={addChecklistItem} type="button">
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>

              <ul className="list-group list-group-flush">
                {checklist.map((item, i) => (
                  <li key={i} className="list-group-item d-flex align-items-center justify-content-between px-0" style={{ fontSize: '0.85rem' }}>
                    <span><i className="bi bi-check-circle-fill text-success me-2"></i>{item}</span>
                    <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => removeChecklistItem(item)} type="button">
                      <i className="bi bi-trash" style={{ fontSize: '0.7rem' }}></i>
                    </button>
                  </li>
                ))}
                {checklist.length === 0 && <p className="text-muted" style={{ fontSize: '0.8rem' }}>No items added</p>}
              </ul>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="col-12">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-aon-red" onClick={handleSave}>
              <i className="bi bi-save me-2"></i>Save Settings
            </button>
            {savedMsg && (
              <span className="text-success d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-check-circle-fill"></i>Saved successfully
              </span>
            )}
          </div>
        </div>

        {/* Google Sheets Connection */}
        <div className="col-12">
          <div className="admin-card">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-google me-2 text-aon-red"></i>Google Sheets Database Connection
              </h6>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                Connect a Google Sheet as your database. Deploy the provided Apps Script (see instructions below) and paste the Web App URL here.
              </p>

              <div className="d-flex gap-2 mb-3">
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={endpoint}
                  onChange={e => setEndpointUrl(e.target.value)}
                />
                <button className="btn btn-aon-red" onClick={saveEndpoint} type="button">
                  <i className="bi bi-link-45deg me-1"></i>Connect
                </button>
                {getEndpointValue() && (
                  <button className="btn btn-outline-danger" onClick={clearSheetConnection} type="button">
                    <i className="bi bi-x-circle me-1"></i>Disconnect
                  </button>
                )}
              </div>

              {getEndpointValue() ? (
                <div className="alert alert-success d-flex align-items-center gap-2 py-2" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-check-circle-fill"></i>
                  Google Sheets is connected. Data will sync automatically.
                </div>
              ) : (
                <div className="alert alert-info d-flex align-items-center gap-2 py-2" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-info-circle-fill"></i>
                  Not connected. Data is saved locally in the browser. Connect Google Sheets to persist across devices.
                </div>
              )}

              {/* Instructions */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>
                  <i className="bi bi-book me-2"></i>How to connect Google Sheets
                </h6>
                <ol className="text-muted ps-3" style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                  <li>Create a new <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-aon-red">Google Sheet</a></li>
                  <li>In the sheet, click <strong>Extensions → Apps Script</strong></li>
                  <li>Delete any code and paste the Apps Script code (see <code>google-apps-script.gs</code> in your project files)</li>
                  <li>Click <strong>Deploy → New deployment</strong>, choose <strong>Web app</strong></li>
                  <li>Set <strong>Execute as: Me</strong>, <strong>Who has access: Anyone</strong></li>
                  <li>Click <strong>Deploy</strong>, authorize the permissions, and copy the Web App URL</li>
                  <li>Paste the URL above and click <strong>Connect</strong></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
