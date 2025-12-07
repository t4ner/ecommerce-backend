import Category from "../models/Category.js";

// Yeni kategori oluştur
export const createCategory = async (req, res) => {
  try {
    const { name, slug, parentId, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name ve slug zorunludur." });
    }

    // Slug benzersiz mi kontrol et
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Bu slug zaten kullanılıyor." });
    }

    const category = new Category({
      name,
      slug,
      parentId: parentId || null,
      description,
    });

    await category.save();

    res.status(201).json({
      message: "Kategori oluşturuldu.",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Tüm kategorileri getir
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Tek kategori getir
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategori güncelle
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, parentId, description } = req.body;

    // Slug değiştiyse benzersiz olmalı
    if (slug) {
      const existSlug = await Category.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existSlug) {
        return res.status(400).json({ message: "Bu slug kullanılıyor." });
      }
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        parentId: parentId || null,
        description,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    res.status(200).json({
      message: "Kategori güncellendi.",
      category: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// Kategori sil
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Alt kategorisi var mı kontrol et
    const sub = await Category.findOne({ parentId: id });
    if (sub) {
      return res.status(400).json({
        message: "Bu kategorinin alt kategorileri var, önce onları sil.",
      });
    }

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    res.status(200).json({ message: "Kategori silindi." });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

// TÜM KATEGORİLERİ AĞAÇ YAPISINDA GETİR
export const getCategoriesTree = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    // Tüm kategorileri ID -> kategori olarak maple
    const map = {};
    categories.forEach((cat) => {
      map[cat._id.toString()] = {
        ...cat,
        children: [],
      };
    });

    const tree = [];

    categories.forEach((cat) => {
      if (cat.parentId) {
        const parentKey = cat.parentId.toString();
        if (map[parentKey]) {
          map[parentKey].children.push(map[cat._id.toString()]);
        }
      } else {
        tree.push(map[cat._id.toString()]);
      }
    });

    res.status(200).json(tree);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
