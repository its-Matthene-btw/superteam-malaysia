
import CategoryForm from '../components/CategoryForm';
import EcosystemLayout from '../../layout';

export default function NewCategoryPage() {
  return (
    <EcosystemLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Category</h1>
          <p className="text-muted-foreground">Fill out the form to add a new category to the ecosystem.</p>
        </div>
        <CategoryForm />
      </div>
    </EcosystemLayout>
  );
}
