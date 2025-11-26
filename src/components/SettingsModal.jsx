import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const SettingsModal = ({ isOpen, onClose }) => {
    const { setSettings, settings } = useGame();
    const [apiKey, setApiKey] = useState(settings?.apiKey || '');
    const [whiteModel, setWhiteModel] = useState(settings?.whiteModel || 'gemini-2.0-flash-exp');
    const [blackModel, setBlackModel] = useState(settings?.blackModel || 'gemini-2.0-flash-exp');

    useEffect(() => {
        if (isOpen && settings) {
            setApiKey(settings.apiKey || '');
            setWhiteModel(settings.whiteModel || 'gemini-2.0-flash-exp');
            setBlackModel(settings.blackModel || 'gemini-2.0-flash-exp');
        }
    }, [isOpen, settings]);

    const handleSave = () => {
        setSettings({
            apiKey,
            whiteModel,
            blackModel
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal card">
                <div className="card__header">Settings</div>
                <div className="card__body">
                    <div className="form-group">
                        <label>Gemini API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API Key"
                        />
                    </div>

                    <div className="form-group">
                        <label>White Player Model</label>
                        <select value={whiteModel} onChange={(e) => setWhiteModel(e.target.value)}>
                            <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Exp</option>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Black Player Model</label>
                        <select value={blackModel} onChange={(e) => setBlackModel(e.target.value)}>
                            <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Exp</option>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button className="button" onClick={onClose}>Cancel</button>
                        <button className="button button--primary" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
