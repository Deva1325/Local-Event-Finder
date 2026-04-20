import { Request, Response } from "express";
import CategoryModel from "../models/CategoryModel";
import { isEmpty, isNumber } from "../utils/validator";
import { successResponse, errorResponse } from "../utils/response";

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        const categoryName = name? name.trim() : name;

        if (isEmpty(categoryName)) {
            return errorResponse(res, "Category Name is required", 400);
        }

        const existingCategory = await CategoryModel.findOne({
            where: { name: categoryName }
        });

        if (existingCategory) {
            return errorResponse(res, "Category already exists", 400);
        }

        const category = await CategoryModel.create({
            name: categoryName,
            description, 
            status: "active"
        });

        return successResponse(res, "Category created successfully!", category, 201);

    } catch (error) {
        console.error("Error while creating category", error);


        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const getCategory = async (req: Request, res: Response) => {
    try {
        const categories = await CategoryModel.findAll({
            where: { status: "active"},
            order: [["created_at", "DESC"]]
        });

        return successResponse(res, "Categories fetched Successfully!", categories, 200);

    } catch (error) {
        console.error("Error while get all categories:", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!isNumber(id) || id<=0) {
            return errorResponse(res,"Invalid category id",400);
        }

        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return errorResponse(res, "Category not found", 404);
        }

        return successResponse(res, "Category fetched Successfully!", category, 200);

    } catch (error) {
        console.error("Error while get specific category:", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, description, status } = req.body;

        if (name!==undefined && isEmpty(name.trim())) {
            return errorResponse(res,"Category name cannot be empty",400);
        }

        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return errorResponse(res, "Category not found", 404);
        }

        if (name) {
            const categoryName = name.trim();

            const existingCategory=await CategoryModel.findOne({
               where: {name: categoryName} 
            });

            if (existingCategory && existingCategory.category_id!=id) {
                return errorResponse(res,"Category already exists with this name",400);
            }
        }

        await category.update({
            name: name ? name.trim() : category.name,
            description: description ?? category.description,
            status: status ?? category.status
        });

        return successResponse(res, "Category updated successfully", category, 200);

    } catch (error) {
        console.error("Update Category Error:", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return errorResponse(res, "ID is required", 400);
        }

        const category = await CategoryModel.findByPk(id);

        if (!category) {
            return errorResponse(res, "Category not found", 404);
        }

        //console.log(category);
        
        // await category.update({
        //    status: "inactive"
        // }); 

        await category.destroy();

        return successResponse(res, "Category deleted successfully");

    } catch (error) {
        console.error("Update Category Error:", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}

