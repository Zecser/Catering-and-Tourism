import { Request, Response } from 'express';
import Service, { IService } from '../models/service.model';
import { isValidObjectId } from 'mongoose';

type MulterFile = Express.Multer.File & {
  path?: string;
  filename?: string;
  public_id?: string;
  secure_url?: string;
};

const fileToImageObj = (file?: MulterFile) => {
  if (!file) return undefined;
  return {
    url: (file.path || file.secure_url || "") as string,
    public_id: (file.filename || file.public_id || "") as string,
  };
};


// List all services 
export const listServices = async (req: Request, res: Response): Promise<void> => {
  try {
  
    const page = parseInt(req.query.page as string) || 1;      
    const limit = parseInt(req.query.limit as string) || 15;   
    const skip = (page - 1) * limit;

   
    const total = await Service.countDocuments();
    const services: IService[] = await Service.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); 

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

// List all headings
export const listTitles = async (req: Request, res: Response): Promise<void> => {
  try {
    const titles = await Service.find().select('title -_id'); 
    res.json(titles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch titles' });
  }
};



// Get detailed service by ID
export const getDetailedService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service: IService | null = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};




// Create a new service
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, heading, description } = req.body;

    if (!title || !heading || !description) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    const file = req.file as MulterFile | undefined;
    const image = fileToImageObj(file);

    const service = await Service.create({
      title,
      heading,
      description,
      image,
    });

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error(" Error in createService:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Update a service
export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid service ID" });
      return;
    }

    const { title, heading, description } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (heading) updateData.heading = heading;
    if (description) updateData.description = description;

    // Only replace image if a new file is uploaded
    if (req.file) {
      updateData.image = {
        url: (req.file as any).path,
        public_id: (req.file as any).filename,
      };
    }

    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      res.status(404).json({ success: false, message: "Service not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error: any) {
    console.error("Update Service Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete service by ID
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedService: IService | null = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};


