// ProductUpdatePage.tsx
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSsid } from "../../hooks/useSsid";
import { useAuth } from "../../hooks/useAuth";
import { Col, Container, Row } from "react-bootstrap";
import Loader from '../../components/Loader/Loader.tsx';
import "./ProductUpdatePage.css"

interface RuleFormData {
    name: string;
    content: string;
    faculty?: string;
    semester?: number;
    building?: string;
    department?: string;
    steps: Array<{ keyword: string; text: string }>;
}

const initialFormData: RuleFormData = {
    name: '',
    content: '',
    faculty: '',
    semester: undefined,
    building: '',
    department: '',
    steps: []
};

const keywordOptions = ['Дано', 'Когда', 'Тогда', 'И', 'То'];

const ProductUpdatePage: FC = () => {
    const { name } = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { session_id } = useSsid();
    const { is_moderator } = useAuth();
    const [formData, setFormData] = useState<RuleFormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        if (name) {
            const fetchRule = async () => {
                try {
                    const response = await axios.get(`/api/constraints/${name}/`);
                    setFormData({
                        ...response.data,
                        steps: response.data.parsed_content?.[0]?.steps || []
                    });
                } catch (error) {
                    console.error('Error fetching rule:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRule();
        } else {
            setLoading(false);
        }
    }, [name]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Название обязательно';
        if (formData.steps.length === 0) newErrors.steps = 'Добавьте хотя бы один шаг';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStepChange = (index: number, field: string, value: string) => {
        const newSteps = [...formData.steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setFormData(prev => ({ ...prev, steps: newSteps }));
    };

    const addStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [...prev.steps, { keyword: 'Дано', text: '' }]
        }));
    };

    const removeStep = (index: number) => {
        setFormData(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index)
        }));
    };

    const generateGherkinContent = () => {
        let content = `Сценарий: ${formData.name}\n`;
        formData.steps.forEach(step => {
            content += `    ${step.keyword} ${step.text}\n`;
        });
        return content;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const dataToSend = {
            ...formData,
            content: generateGherkinContent()
        };

        try {
            if (name) {
                await axios.put(`/api/constraints/${name}/`, dataToSend, {
                    //headers: { 'Authorization': session_id }
                });
            } else {
                await axios.post('/api/constraints/', dataToSend, {
                    //headers: { 'Authorization': session_id }
                });
            }
            navigate('/products');
        } catch (error) {
            console.error('Error saving rule:', error);
        }
    };

    if (loading) return <Loader />;

    return (
        <Container>
            <h1 className="page-title">
                {name ? 'Редактирование правила' : 'Создание нового правила'}
            </h1>
            
            <form onSubmit={handleSubmit} className="rule-form">
                <div className="form-section">
                    <label>
                        Название сценария:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </label>
                </div>

                <div className="form-section">
                    <h3>Шаги сценария:</h3>
                    {formData.steps.map((step, index) => (
                        <div key={index} className="step-block">
                            <select
                                value={step.keyword}
                                onChange={(e) => handleStepChange(index, 'keyword', e.target.value)}
                            >
                                {keywordOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={step.text}
                                onChange={(e) => handleStepChange(index, 'text', e.target.value)}
                                placeholder="Описание шага"
                            />
                            <button
                                type="button"
                                className="remove-step"
                                onClick={() => removeStep(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addStep} className="add-step">
                        Добавить шаг
                    </button>
                    {errors.steps && <span className="error-message">{errors.steps}</span>}
                </div>

                <div className="form-section grid-columns">
                    <label>
                        Факультет:
                        <input
                            type="text"
                            name="faculty"
                            value={formData.faculty}
                            onChange={handleInputChange}
                        />
                    </label>
                    
                    <label>
                        Семестр:
                        <input
                            type="number"
                            name="semester"
                            value={formData.semester || ''}
                            onChange={handleInputChange}
                            min="1"
                            max="12"
                        />
                    </label>
                    
                    <label>
                        Корпус:
                        <input
                            type="text"
                            name="building"
                            value={formData.building}
                            onChange={handleInputChange}
                        />
                    </label>
                    
                    <label>
                        Кафедра:
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>

                <button type="submit" className="submit-button">
                    {name ? 'Сохранить изменения' : 'Создать правило'}
                </button>
            </form>
        </Container>
    );
};

export default ProductUpdatePage;