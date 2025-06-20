// ProductUpdatePage.tsx
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "react-bootstrap";
import Loader from '../../components/Loader/Loader.tsx';
import "./ProductUpdatePage.css"

interface RuleFormData {
    name: string;
    content: string;
    faculty?: string;
    semester?: number;
    building?: string;
    department?: string;
    steps: Array<{ keyword: string; text: string; type?: string; value?: string }>;
}

interface FilterData {
    buildings: string[];
    audiences: {id: number, name: string, building: string}[];
    faculties: string[];
    departments: string[];
    groups: string[];
    disciplines: string[];
    teachers: string[];
    weekTypes: string[];
    days: string[];
}

const initialFormData: RuleFormData = {
    name: '',
    content: '',
    faculty: '',
    semester: undefined,
    building: '',
    department: '',
    steps: [
        { keyword: 'Дано', text: 'Для каждого занятия' },
        { keyword: 'То', text: 'такое сочетание обязательно' }
    ]
};

const normalizeStep = (step: any) => {
    if (step.keyword !== 'И') return step;
    
    // Определяем тип шага по тексту
    const matchedOption = andOptions.find(option => 
        step.text.startsWith(option.label)
    );
    
    if (!matchedOption) return { ...step, type: 'other', value: step.text };

    // Извлекаем значение из текста
    const valueStart = matchedOption.label.length;
    let value = step.text.substring(valueStart).trim();
    
    // Убираем кавычки если они есть
    if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
    }
    
    // Для пары убираем слово "пара"
    if (matchedOption.value === 'pair' && value.endsWith(' пара')) {
        value = value.replace(' пара', '');
    }
    
    return { 
        ...step, 
        type: matchedOption.value, 
        value: value 
    };
};

const keywordOptions = ['Дано', 'И'];

const andOptions = [
    { value: 'group', label: 'у группы' },
    { value: 'semester', label: 'семестра' },
    { value: 'discipline', label: 'по дисциплине' },
    { value: 'building', label: 'в корпусе' },
    { value: 'audience', label: 'в аудитории' },
    { value: 'teacher', label: 'у преподавателя' },
    { value: 'faculty', label: 'факультета' },
    { value: 'department', label: 'кафедры' },
    { value: 'week', label: 'неделя' },
    { value: 'day', label: 'день' },
    { value: 'pair', label: 'пара' },
    { value: 'other', label: 'другое' }
];

const ProductUpdatePage: FC = () => {
    const { name } = useParams();
    const [loading, setLoading] = useState(true);
    const [filterData, setFilterData] = useState<FilterData>({
        buildings: [],
        audiences: [],
        faculties: [],
        departments: [],
        groups: [],
        disciplines: [],
        teachers: [],
        weekTypes: ['числитель', 'знаменатель'],
        days: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье']
    });
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RuleFormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [usedAndTypes, setUsedAndTypes] = useState<Set<string>>(new Set());
    const [audienceFilter, setAudienceFilter] = useState({ building: '', floor: '' });

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const buildingsRes = await axios.get('/api/buildings/');
                const audiencesRes = await axios.get('/api/audiences/');
                const lessonsRes = await axios.get('/api/lessons/');
                
                const faculties = Array.from(
                    new Set(lessonsRes.data.map((l: any) => l.faculty).filter(Boolean))
                ).sort() as string[];
                
                const departments = Array.from(
                    new Set(lessonsRes.data.map((l: any) => l.department).filter(Boolean))
                ).sort() as string[];
                
                const groups = Array.from(
                    new Set(lessonsRes.data.map((l: any) => l.grp).filter(Boolean))
                ).sort() as string[];
                
                const disciplines = Array.from(
                    new Set(lessonsRes.data.map((l: any) => l.short_name).filter(Boolean))
                ).sort() as string[];
                
                const teachers = Array.from(
                    new Set(lessonsRes.data.map((l: any) => l.teacher).filter(Boolean))
                ).sort() as string[];

                setFilterData({
                    buildings: buildingsRes.data,
                    audiences: audiencesRes.data,
                    faculties,
                    departments,
                    groups,
                    disciplines,
                    teachers,
                    weekTypes: ['числитель', 'знаменатель'],
                    days: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресеньe']
                });
            } catch (error) {
                console.error('Error fetching filter data:', error);
            }
        };

        fetchFilterData();
    }, []);

    useEffect(() => {
        if (name) {
            const fetchRule = async () => {
                try {
                    const response = await axios.get(`/api/constraints/${name}/`);
                    const ruleData = response.data;
                    
                    // Формируем шаги из parsed_content
                    let steps = ruleData.parsed_content?.[0]?.steps || [];
                    steps = steps.map(normalizeStep);
                    // Гарантируем, что шаг "То" есть и он последний
                    if (!steps.some(step => step.keyword === 'То')) {
                        steps = [...steps, { keyword: 'То', text: 'такое сочетание обязательно' }];
                    } else {
                        // Перемещаем "То" в конец
                        const toStep = steps.find(step => step.keyword === 'То');
                        steps = steps.filter(step => step.keyword !== 'То');
                        steps.push(toStep!);
                    }
                    
                    // Создаем новую форму с данными из ответа
                    const newFormData: RuleFormData = {
                        name: ruleData.name,
                        content: ruleData.content,
                        faculty: ruleData.faculty,
                        semester: ruleData.semester,
                        building: ruleData.building,
                        department: ruleData.department,
                        steps: steps
                    };
                    
                    setFormData(newFormData);
                    updateScenarioName(steps);
                    
                    // Обновляем использованные типы
                    const types = new Set<string>();
                    steps.forEach(step => {
                        if (step.keyword === 'И' && step.type) {
                            types.add(step.type);
                        }
                    });
                    setUsedAndTypes(types);
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

    useEffect(() => {
        // Синхронизация полей формы с шагами
        const newData: Partial<RuleFormData> = {};
        const stepValues: Record<string, any> = {};

        formData.steps.forEach(step => {
            if (step.keyword === 'И' && step.type && step.value) {
                stepValues[step.type] = step.value;
                
                if (step.type === 'faculty') newData.faculty = step.value;
                else if (step.type === 'semester') newData.semester = parseInt(step.value, 10);
                else if (step.type === 'building') newData.building = step.value;
                else if (step.type === 'department') newData.department = step.value;
            }
        });

        setFormData(prev => ({ ...prev, ...newData }));
    }, [formData.steps]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Название обязательно';
        if (formData.steps.length === 0) newErrors.steps = 'Добавьте хотя бы один шаг';
        
        // Проверка шага "То"
        const toStep = formData.steps.find(step => step.keyword === 'То');
        if (!toStep) {
            newErrors.steps = 'Добавьте шаг "То"';
        } else if (!['такое сочетание обязательно', 'такое сочетание желательно'].includes(toStep.text)) {
            newErrors.steps = 'Некорректное значение для шага "То"';
        }

        // Проверка уникальности типов "И"
        const andTypes = new Set<string>();
        formData.steps.forEach(step => {
            if (step.keyword === 'И' && step.type) {
                if (andTypes.has(step.type)) {
                    newErrors.steps = `Тип "${step.type}" может быть использован только один раз`;
                }
                andTypes.add(step.type);
            }
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateScenarioName = (steps: any[]) => {
        const scenarioParts: string[] = [];
        const andValues: Record<string, string> = {};

        steps.forEach(step => {
            if (step.keyword === 'И' && step.type && step.value) {
                andValues[step.type] = step.value;
            }
        });

        // Порядок элементов в названии (приоритет отображения)
        const priorityOrder = [
            'discipline', 'group', 'semester', 'week', 'day', 
            'pair', 'building', 'audience', 'faculty', 'department'
        ];
        
        priorityOrder.forEach(type => {
            if (andValues[type]) {
                if (type === 'semester') {
                    scenarioParts.push(`сем. ${andValues[type]}`);
                } else if (type === 'week') {
                    scenarioParts.push(`нед. ${andValues[type]}`);
                } else if (type === 'pair') {
                    scenarioParts.push(`${andValues[type]} пара`);
                } else if (type === 'audience') {
                    scenarioParts.push(`ауд. ${andValues[type]}`);
                } else {
                    scenarioParts.push(andValues[type]);
                }
            }
        });

        // Определение типа сценария
        const toStep = steps.find(step => step.keyword === 'То');
        const scenarioType = toStep && toStep.text.includes('обязательно') 
            ? 'Обязательно' 
            : 'Желательно';

        const newName = scenarioParts.length 
            ? `${scenarioType} (${scenarioParts.join(', ')})`
            : scenarioType;

        setFormData(prev => ({ ...prev, name: newName }));
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Обновляем поле в форме
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Обновляем соответствующий шаг
        const stepTypeMap: Record<string, string> = {
            'faculty': 'faculty',
            'semester': 'semester',
            'building': 'building',
            'department': 'department'
        };
        
        const stepType = stepTypeMap[name];
        if (stepType) {
            const stepIndex = formData.steps.findIndex(
                step => step.keyword === 'И' && step.type === stepType
            );
            
            if (stepIndex >= 0) {
                // Обновляем существующий шаг
                handleStepChange(stepIndex, 'value', value);
            } else {
                // Добавляем новый шаг
                const toIndex = formData.steps.findIndex(step => step.keyword === 'То');
                const newSteps = [...formData.steps];
                
                const newStep = {
                    keyword: 'И',
                    type: stepType,
                    value: value,
                    text: `${andOptions.find(opt => opt.value === stepType)?.label || ''} '${value}'`
                };
                
                if (toIndex >= 0) {
                    newSteps.splice(toIndex, 0, newStep);
                } else {
                    newSteps.push(newStep);
                }
                
                setFormData(prev => ({ ...prev, steps: newSteps }));
                updateScenarioName(newSteps);
            }
        }
        
        // Обновляем фильтр аудиторий
        if (name === 'audienceBuilding') {
            setAudienceFilter(prev => ({ ...prev, building: value }));
        } else if (name === 'audienceFloor') {
            setAudienceFilter(prev => ({ ...prev, floor: value }));
        }
    };

    const handleStepChange = (index: number, field: string, value: string) => {
        const newSteps = [...formData.steps];
        const step = { ...newSteps[index] };
        
        // Для шага "То" разрешаем менять только текст
        if (step.keyword === 'То' && field !== 'text') {
            return;
        }
        
        if (field === 'keyword') {
            if (step.keyword === 'То') return;
            step.keyword = value;
            step.text = '';
            step.type = '';
            step.value = '';
            
            if (value === 'Дано') {
                step.text = 'Для каждого занятия';
            }
        } 
        else if (field === 'type') {
            step.type = value;
            step.value = '';
            step.text = andOptions.find(opt => opt.value === value)?.label || '';
            
            const newUsedTypes = new Set(usedAndTypes);
            if (step.type) {
                newUsedTypes.add(step.type);
            }
            setUsedAndTypes(newUsedTypes);
        } 
        else if (field === 'value') {
            step.value = value;
            
            if (step.keyword === 'И' && step.type) {
                const optionLabel = andOptions.find(opt => opt.value === step.type)?.label || '';
                if (step.type === 'pair') {
                    step.text = `${optionLabel} '${value} пара'`;
                } else {
                    step.text = `${optionLabel} '${value}'`;
                }
                
                // Синхронизируем с полями формы
                if (step.type === 'faculty') {
                    setFormData(prev => ({ ...prev, faculty: value }));
                } else if (step.type === 'semester') {
                    setFormData(prev => ({ ...prev, semester: parseInt(value, 10) }));
                } else if (step.type === 'building') {
                    setFormData(prev => ({ ...prev, building: value }));
                } else if (step.type === 'department') {
                    setFormData(prev => ({ ...prev, department: value }));
                }
            }
        }
        else if (field === 'text') {
            step.text = value;
        }
        
        newSteps[index] = step;
        const newFormData = { ...formData, steps: newSteps };
        setFormData(newFormData);
        updateScenarioName(newSteps);
    };

    const addStep = () => {
        // Добавляем шаг перед "То"
        const toIndex = formData.steps.findIndex(step => step.keyword === 'То');
        const newSteps = [...formData.steps];
        
        const newStep = { keyword: 'И', text: '', type: '', value: '' };
        
        if (toIndex >= 0) {
            newSteps.splice(toIndex, 0, newStep);
        } else {
            newSteps.push(newStep);
        }
        
        setFormData(prev => ({ ...prev, steps: newSteps }));
    };

    const removeStep = (index: number) => {
        const step = formData.steps[index];
        if (step.keyword === 'Дано' || step.keyword === 'То') {
            return;
        }
        const newSteps = formData.steps.filter((_, i) => i !== index);
        const newFormData = { ...formData, steps: newSteps };
        
        if (step.keyword === 'И' && step.type) {
            const newUsedTypes = new Set(usedAndTypes);
            newUsedTypes.delete(step.type);
            setUsedAndTypes(newUsedTypes);
        }
        
        setFormData(newFormData);
        updateScenarioName(newSteps);
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
                await axios.put(`/api/constraints/${name}/`, dataToSend);
            } else {
                await axios.post('/api/constraints/', dataToSend);
            }
            navigate('/products');
        } catch (error) {
            console.error('Error saving rule:', error);
        }
    };

    const renderAndInput = (step: any, index: number) => {
        if (!step.type) return null;

        switch (step.type) {
            case 'group':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите группу</option>
                        {filterData.groups.map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                );
                
            case 'semester':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите семестр</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                        ))}
                    </select>
                );
                
            case 'discipline':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите дисциплину</option>
                        {filterData.disciplines.map(discipline => (
                            <option key={discipline} value={discipline}>{discipline}</option>
                        ))}
                    </select>
                );
                
            case 'building':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите корпус</option>
                        {filterData.buildings.map(building => (
                            <option key={building} value={building}>{building}</option>
                        ))}
                    </select>
                );
                
            case 'audience':
                // Фильтрация аудиторий
                let filteredAudiences = filterData.audiences;
                if (audienceFilter.building) {
                    filteredAudiences = filteredAudiences.filter(a => 
                        a.building === audienceFilter.building);
                }
                if (audienceFilter.floor) {
                    filteredAudiences = filteredAudiences.filter(a => 
                        a.floor.toString() === audienceFilter.floor);
                }
                
                return (
                    <div className="audience-selector">
                        <div className="audience-filters">
                            <select
                                name="audienceBuilding"
                                value={audienceFilter.building}
                                onChange={handleInputChange}
                            >
                                <option value="">Все корпуса</option>
                                {filterData.buildings.map(building => (
                                    <option key={building} value={building}>{building}</option>
                                ))}
                            </select>
                            
                            <select
                                name="audienceFloor"
                                value={audienceFilter.floor}
                                onChange={handleInputChange}
                            >
                                <option value="">Все этажи</option>
                                {Array.from(new Set(filterData.audiences.map(a => a.floor)))
                                    .sort()
                                    .map(floor => (
                                    <option key={floor} value={floor.toString()}>{floor} этаж</option>
                                ))}
                            </select>
                        </div>
                        
                        <select
                            value={step.value || ''}
                            onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                        >
                            <option value="">Выберите аудиторию</option>
                            {filteredAudiences.map(audience => (
                                <option key={audience.id} value={audience.name}>
                                    {audience.building} {audience.name} ({audience.floor} этаж)
                                </option>
                            ))}
                        </select>
                    </div>
                );
                
            case 'teacher':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите преподавателя</option>
                        {filterData.teachers.map(teacher => (
                            <option key={teacher} value={teacher}>{teacher}</option>
                        ))}
                    </select>
                );
                
            case 'faculty':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите факультет</option>
                        {filterData.faculties.map(faculty => (
                            <option key={faculty} value={faculty}>{faculty}</option>
                        ))}
                    </select>
                );
                
            case 'department':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите кафедру</option>
                        {filterData.departments.map(department => (
                            <option key={department} value={department}>{department}</option>
                        ))}
                    </select>
                );
                
            case 'week':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите неделю</option>
                        {filterData.weekTypes.map(week => (
                            <option key={week} value={week}>{week}</option>
                        ))}
                    </select>
                );
                
            case 'day':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите день</option>
                        {filterData.days.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                );
                
            case 'pair':
                return (
                    <select
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                    >
                        <option value="">Выберите пару</option>
                        {[1, 2, 3, 4, 5, 6, 7].map(pair => (
                            <option key={pair} value={pair.toString()}>{pair}</option>
                        ))}
                    </select>
                );
                
            case 'other':
                return (
                    <input
                        type="text"
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                        placeholder="Введите значение"
                    />
                );
                
            default:
                return (
                    <input
                        type="text"
                        value={step.value || ''}
                        onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                        placeholder="Введите значение"
                    />
                );
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
                            readOnly
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
                                disabled={step.keyword === 'То' || step.keyword === 'Дано'}
                            >
                                {keywordOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                                {/* Шаг "То" всегда доступен, но его нельзя выбрать для других шагов */}
                                <option value="То" disabled>То</option>
                            </select>
                            
                            {step.keyword === 'И' && (
                                <>
                                    <select
                                        value={step.type || ''}
                                        onChange={(e) => handleStepChange(index, 'type', e.target.value)}
                                        disabled={step.keyword !== 'И'}
                                    >
                                        <option value="">Выберите тип</option>
                                        {andOptions.map(option => (
                                            <option 
                                                key={option.value} 
                                                value={option.value}
                                                disabled={usedAndTypes.has(option.value) && step.type !== option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    {step.type && renderAndInput(step, index)}
                                </>
                            )}
                            
                            {step.keyword === 'То' && (
                                <select
                                    value={step.text}
                                    onChange={(e) => handleStepChange(index, 'text', e.target.value)}
                                >
                                    <option value="такое сочетание обязательно">такое сочетание обязательно</option>
                                    <option value="такое сочетание желательно">такое сочетание желательно</option>
                                </select>
                            )}
                            
                            {step.keyword === 'Дано' && (
                                <input
                                    type="text"
                                    value={step.text}
                                    readOnly
                                />
                            )}
                            
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
                    <label className="step-block">
                        Факультет:
                        <select
                            name="faculty"
                            value={formData.faculty || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Выберите факультет</option>
                            {filterData.faculties.map(faculty => (
                                <option key={faculty} value={faculty}>{faculty}</option>
                            ))}
                        </select>
                    </label>
                    
                    <label className="step-block">
                        Семестр:
                        <select
                            name="semester"
                            value={formData.semester || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Выберите семестр</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </label>
                    
                    <label className="step-block">
                        Корпус:
                        <select
                            name="building"
                            value={formData.building || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Выберите корпус</option>
                            {filterData.buildings.map(building => (
                                <option key={building} value={building}>{building}</option>
                            ))}
                        </select>
                    </label>
                    
                    <label className="step-block">
                        Кафедра:
                        <select
                            name="department"
                            value={formData.department || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Выберите кафедру</option>
                            {filterData.departments.map(department => (
                                <option key={department} value={department}>{department}</option>
                            ))}
                        </select>
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