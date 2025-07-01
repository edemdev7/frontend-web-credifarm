import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Table, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAdminStore } from '../../store/adminStore';
import { useWaterBasinStore } from '../../store/waterBasinStore';
import { IAdmin } from '../types/admin';
import { IWaterBasin } from '../types/waterBasin';
import { mockData } from '../../api/mockData';

const { Option } = Select;

const ControlPanel: FC = () => {
  const navigate = useNavigate();
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
  const [isWaterBasinModalVisible, setIsWaterBasinModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<IAdmin | null>(null);
  const [editingWaterBasin, setEditingWaterBasin] = useState<IWaterBasin | null>(null);
  const [adminForm] = Form.useForm();
  const [waterBasinForm] = Form.useForm();

  const { admins, isLoading: isAdminsLoading, fetchAdmins, addAdmin, updateAdmin, deleteAdmin } = useAdminStore();
  const { waterBasins, isLoading: isWaterBasinsLoading, fetchWaterBasins, addWaterBasin, updateWaterBasin, deleteWaterBasin } = useWaterBasinStore();

  useEffect(() => {
    fetchAdmins();
    fetchWaterBasins();
  }, [fetchAdmins, fetchWaterBasins]);

  // Gestion des administrateurs
  const handleAddAdmin = () => {
    setEditingAdmin(null);
    adminForm.resetFields();
    setIsAdminModalVisible(true);
  };

  const handleEditAdmin = (admin: IAdmin) => {
    setEditingAdmin(admin);
    adminForm.setFieldsValue(admin);
    setIsAdminModalVisible(true);
  };

  const handleDeleteAdmin = async (id: number) => {
    try {
      await deleteAdmin(id);
      message.success('Administrateur supprimé avec succès');
    } catch (error) {
      message.error('Erreur lors de la suppression de l\'administrateur');
    }
  };

  const handleAdminSubmit = async (values: any) => {
    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin.id, values);
        message.success('Administrateur modifié avec succès');
      } else {
        await addAdmin(values);
        message.success('Administrateur ajouté avec succès');
      }
      setIsAdminModalVisible(false);
    } catch (error) {
      message.error('Erreur lors de l\'enregistrement de l\'administrateur');
    }
  };

  // Gestion des bassins d'eau
  const handleAddWaterBasin = () => {
    setEditingWaterBasin(null);
    waterBasinForm.resetFields();
    setIsWaterBasinModalVisible(true);
  };

  const handleEditWaterBasin = (basin: IWaterBasin) => {
    setEditingWaterBasin(basin);
    waterBasinForm.setFieldsValue({
      ...basin,
      regionId: basin.region.id,
      departmentId: basin.department.id,
    });
    setIsWaterBasinModalVisible(true);
  };

  const handleDeleteWaterBasin = async (id: number) => {
    try {
      await deleteWaterBasin(id);
      message.success('Bassin d\'eau supprimé avec succès');
    } catch (error) {
      message.error('Erreur lors de la suppression du bassin d\'eau');
    }
  };

  const handleWaterBasinSubmit = async (values: any) => {
    try {
      if (editingWaterBasin) {
        await updateWaterBasin(editingWaterBasin.id, values);
        message.success('Bassin d\'eau modifié avec succès');
      } else {
        await addWaterBasin(values);
        message.success('Bassin d\'eau ajouté avec succès');
      }
      setIsWaterBasinModalVisible(false);
    } catch (error) {
      message.error('Erreur lors de l\'enregistrement du bassin d\'eau');
    }
  };

  const adminColumns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nom d\'utilisateur',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Super Admin',
      dataIndex: 'isSuperAdmin',
      key: 'isSuperAdmin',
      render: (isSuperAdmin: boolean) => isSuperAdmin ? 'Oui' : 'Non',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: IAdmin) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditAdmin(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteAdmin(record.id)}
          />
        </>
      ),
    },
  ];

  const waterBasinColumns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Surface (m²)',
      dataIndex: 'surfaceArea',
      key: 'surfaceArea',
    },
    {
      title: 'Capacité (m³)',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Région',
      dataIndex: ['region', 'name'],
      key: 'region',
    },
    {
      title: 'Département',
      dataIndex: ['department', 'name'],
      key: 'department',
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: IWaterBasin) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditWaterBasin(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteWaterBasin(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Gestion des administrateurs">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddAdmin}
              style={{ marginBottom: 16 }}
            >
              Ajouter un administrateur
            </Button>
            <Table
              columns={adminColumns}
              dataSource={admins}
              rowKey="id"
              loading={isAdminsLoading}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Gestion des bassins d'eau">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddWaterBasin}
              style={{ marginBottom: 16 }}
            >
              Ajouter un bassin d'eau
            </Button>
            <Table
              columns={waterBasinColumns}
              dataSource={waterBasins}
              rowKey="id"
              loading={isWaterBasinsLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* Modal pour les administrateurs */}
      <Modal
        title={editingAdmin ? 'Modifier l\'administrateur' : 'Ajouter un administrateur'}
        open={isAdminModalVisible}
        onCancel={() => setIsAdminModalVisible(false)}
        footer={null}
      >
        <Form
          form={adminForm}
          layout="vertical"
          onFinish={handleAdminSubmit}
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="Nom d'utilisateur"
            rules={[{ required: true, message: 'Veuillez entrer le nom d\'utilisateur' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isSuperAdmin"
            label="Super Admin"
            rules={[{ required: true, message: 'Veuillez sélectionner le statut' }]}
          >
            <Select>
              <Option value={true}>Oui</Option>
              <Option value={false}>Non</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAdmin ? 'Modifier' : 'Ajouter'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal pour les bassins d'eau */}
      <Modal
        title={editingWaterBasin ? 'Modifier le bassin d\'eau' : 'Ajouter un bassin d\'eau'}
        open={isWaterBasinModalVisible}
        onCancel={() => setIsWaterBasinModalVisible(false)}
        footer={null}
      >
        <Form
          form={waterBasinForm}
          layout="vertical"
          onFinish={handleWaterBasinSubmit}
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Veuillez entrer la description' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="surfaceArea"
            label="Surface (m²)"
            rules={[{ required: true, message: 'Veuillez entrer la surface' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacité (m³)"
            rules={[{ required: true, message: 'Veuillez entrer la capacité' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="regionId"
            label="Région"
            rules={[{ required: true, message: 'Veuillez sélectionner la région' }]}
          >
            <Select>
              {mockData.regions.map(region => (
                <Option key={region.id} value={region.id}>{region.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="departmentId"
            label="Département"
            rules={[{ required: true, message: 'Veuillez sélectionner le département' }]}
          >
            <Select>
              {mockData.departments.map(department => (
                <Option key={department.id} value={department.id}>{department.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Statut"
            rules={[{ required: true, message: 'Veuillez sélectionner le statut' }]}
          >
            <Select>
              <Option value="ACTIVE">Actif</Option>
              <Option value="MAINTENANCE">En maintenance</Option>
              <Option value="INACTIVE">Inactif</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingWaterBasin ? 'Modifier' : 'Ajouter'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ControlPanel; 