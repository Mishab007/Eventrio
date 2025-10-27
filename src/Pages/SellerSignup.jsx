import { useState } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

const PartnerSignup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Shop Information
    shopName: '',
    shopDescription: '',
    shopLogo: '',
    shopBanner: '',
    shopCategory: 'fashion',
    
    // Business Information
    businessType: 'individual',
    businessName: '',
    taxId: '',
    businessLicense: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    businessCountry: '',
    
    // Bank Information
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    
    // Additional Information
    yearsInBusiness: '',
    estimatedMonthlyOrders: '',
    productCategories: [],
    websiteUrl: '',
    socialMediaLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    
    // Terms & Conditions
    agreeToTerms: false,
    agreeToCommission: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productCategoryOptions = [
    'Clothing', 'Shoes', 'Accessories', 'Watches', 'Bags', 
    'Jewelry', 'Sportswear', 'Kids Fashion', 'Home & Living'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const handleFileUpload = (fieldName, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (currentStep === 2) {
      if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
      if (!formData.shopDescription.trim()) newErrors.shopDescription = 'Shop description is required';
      if (!formData.shopLogo) newErrors.shopLogo = 'Shop logo is required';
    }

    if (currentStep === 3) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
      if (!formData.businessCity.trim()) newErrors.businessCity = 'City is required';
      if (!formData.businessState.trim()) newErrors.businessState = 'State is required';
      if (!formData.businessZip.trim()) newErrors.businessZip = 'ZIP code is required';
      if (!formData.businessCountry.trim()) newErrors.businessCountry = 'Country is required';
    }

    if (currentStep === 4) {
      if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
      if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    }

    if (currentStep === 5) {
      if (formData.productCategories.length === 0) newErrors.productCategories = 'Select at least one category';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
      if (!formData.agreeToCommission) newErrors.agreeToCommission = 'You must agree to commission structure';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(5)) return;

    setIsSubmitting(true);

    try {
      // Prepare seller data
      const sellerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'partner',
        partnerProfile: {
          shopName: formData.shopName,
          shopDescription: formData.shopDescription,
          shopLogo: formData.shopLogo,
          shopBanner: formData.shopBanner,
          shopCategory: formData.shopCategory,
          businessType: formData.businessType,
          businessName: formData.businessName,
          taxId: formData.taxId,
          businessLicense: formData.businessLicense,
          businessAddress: {
            street: formData.businessAddress,
            city: formData.businessCity,
            state: formData.businessState,
            zip: formData.businessZip,
            country: formData.businessCountry
          },
          bankInfo: {
            bankName: formData.bankName,
            accountHolderName: formData.accountHolderName,
            accountNumber: formData.accountNumber,
            routingNumber: formData.routingNumber
          },
          yearsInBusiness: formData.yearsInBusiness,
          estimatedMonthlyOrders: formData.estimatedMonthlyOrders,
          productCategories: formData.productCategories,
          websiteUrl: formData.websiteUrl,
          socialMediaLinks: formData.socialMediaLinks,
          status: 'pending_approval', // Admin must approve
          createdAt: new Date().toISOString()
        }
      };

      const success = await signup(
        sellerData.name,
        sellerData.email,
        sellerData.password,
        'partner',
        false
      );

      if (success) {
        alert('Partner account created successfully! Your account is pending admin approval. You will be notified via email once approved.');
        navigate('/partner/dashboard');
      }
    } catch (error) {
      console.error('Seller signup error:', error);
      alert('Failed to create partner account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= s ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {s}
            </div>
            {s < 5 && (
              <div className={`flex-1 h-1 mx-2 ${
                step > s ? 'bg-purple-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 px-2">
        <span>Personal</span>
        <span>Shop Info</span>
        <span>Business</span>
        <span>Banking</span>
        <span>Complete</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Become a Partner</h1>
          <p className="text-gray-600 mt-2">Join Mall of Men and start selling your products today!</p>
        </div>

        {renderProgressBar()}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Min. 6 characters"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Shop Information */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shop Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shop Name *</label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.shopName ? 'border-red-500' : ''}`}
                  placeholder="Fashion Boutique"
                />
                {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Shop Description *</label>
                <textarea
                  name="shopDescription"
                  value={formData.shopDescription}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full border rounded px-3 py-2 ${errors.shopDescription ? 'border-red-500' : ''}`}
                  placeholder="Tell customers about your shop, products, and what makes you unique..."
                />
                {errors.shopDescription && <p className="text-red-500 text-xs mt-1">{errors.shopDescription}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Shop Category</label>
                <select
                  name="shopCategory"
                  value={formData.shopCategory}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="footwear">Footwear</option>
                  <option value="accessories">Accessories</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="bags">Bags & Luggage</option>
                  <option value="watches">Watches</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Shop Logo * (Square, min 200x200px)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('shopLogo', e.target.files[0])}
                  className="w-full border rounded px-3 py-2"
                />
                {formData.shopLogo && (
                  <img src={formData.shopLogo} alt="Shop logo preview" className="mt-2 w-32 h-32 object-cover rounded border" />
                )}
                {errors.shopLogo && <p className="text-red-500 text-xs mt-1">{errors.shopLogo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Shop Banner (Optional, 1200x400px recommended)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('shopBanner', e.target.files[0])}
                  className="w-full border rounded px-3 py-2"
                />
                {formData.shopBanner && (
                  <img src={formData.shopBanner} alt="Shop banner preview" className="mt-2 w-full h-32 object-cover rounded border" />
                )}
              </div>
            </div>
          )}

          {/* Step 3: Business Information */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Business Type</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="individual">Individual/Sole Proprietor</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Legal Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.businessName ? 'border-red-500' : ''}`}
                />
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tax ID / EIN (Optional)</label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="XX-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Business License (Optional)</label>
                  <input
                    type="text"
                    name="businessLicense"
                    value={formData.businessLicense}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Business Address *</label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.businessAddress ? 'border-red-500' : ''}`}
                  placeholder="Street address"
                />
                {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="businessCity"
                    value={formData.businessCity}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${errors.businessCity ? 'border-red-500' : ''}`}
                  />
                  {errors.businessCity && <p className="text-red-500 text-xs mt-1">{errors.businessCity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">State/Province *</label>
                  <input
                    type="text"
                    name="businessState"
                    value={formData.businessState}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${errors.businessState ? 'border-red-500' : ''}`}
                  />
                  {errors.businessState && <p className="text-red-500 text-xs mt-1">{errors.businessState}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP/Postal Code *</label>
                  <input
                    type="text"
                    name="businessZip"
                    value={formData.businessZip}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${errors.businessZip ? 'border-red-500' : ''}`}
                  />
                  {errors.businessZip && <p className="text-red-500 text-xs mt-1">{errors.businessZip}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Country *</label>
                  <input
                    type="text"
                    name="businessCountry"
                    value={formData.businessCountry}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${errors.businessCountry ? 'border-red-500' : ''}`}
                  />
                  {errors.businessCountry && <p className="text-red-500 text-xs mt-1">{errors.businessCountry}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Banking Information */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Banking Information</h2>
              <p className="text-sm text-gray-600 mb-4">This information is required for payment processing. All data is encrypted and secure.</p>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bank Name *</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.bankName ? 'border-red-500' : ''}`}
                  placeholder="Bank of America, Chase, etc."
                />
                {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.accountHolderName ? 'border-red-500' : ''}`}
                  placeholder="Full name as on account"
                />
                {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 ${errors.accountNumber ? 'border-red-500' : ''}`}
                  placeholder="XXXXXXXXXXXX"
                />
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Routing Number (Optional)</label>
                <input
                  type="text"
                  name="routingNumber"
                  value={formData.routingNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="XXXXXXXXX"
                />
              </div>
            </div>
          )}

          {/* Step 5: Additional Info & Terms */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Years in Business (Optional)</label>
                  <input
                    type="number"
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Monthly Orders</label>
                  <select
                    name="estimatedMonthlyOrders"
                    value={formData.estimatedMonthlyOrders}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select range</option>
                    <option value="1-50">1-50 orders</option>
                    <option value="51-200">51-200 orders</option>
                    <option value="201-500">201-500 orders</option>
                    <option value="500+">500+ orders</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Product Categories *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {productCategoryOptions.map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-4 py-2 rounded border text-sm ${
                        formData.productCategories.includes(category)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                {errors.productCategories && <p className="text-red-500 text-xs mt-1">{errors.productCategories}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Social Media (Optional)</label>
                <div className="space-y-2">
                  <input
                    type="url"
                    name="socialMediaLinks.facebook"
                    value={formData.socialMediaLinks.facebook}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Facebook URL"
                  />
                  <input
                    type="url"
                    name="socialMediaLinks.instagram"
                    value={formData.socialMediaLinks.instagram}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Instagram URL"
                  />
                  <input
                    type="url"
                    name="socialMediaLinks.twitter"
                    value={formData.socialMediaLinks.twitter}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Twitter URL"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Terms & Conditions</h3>
                
                <div className="space-y-4 bg-gray-50 p-4 rounded">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                      I agree to the <Link to="/terms" className="text-purple-600 hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link> *
                    </label>
                  </div>
                  {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToCommission"
                      name="agreeToCommission"
                      checked={formData.agreeToCommission}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToCommission" className="ml-3 text-sm text-gray-700">
                      I understand and agree to the platform commission structure (10% per sale) *
                    </label>
                  </div>
                  {errors.agreeToCommission && <p className="text-red-500 text-xs">{errors.agreeToCommission}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded font-medium ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-purple-600 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerSignup;
